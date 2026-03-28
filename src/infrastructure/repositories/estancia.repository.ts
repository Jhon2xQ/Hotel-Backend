import { inject, injectable } from "tsyringe";
import { PrismaClient, Prisma } from "../../../generated/prisma/client";
import { Estancia, CreateEstanciaData, EstadoEstadia } from "../../domain/entities/estancia.entity";
import { Habitacion } from "../../domain/entities/habitacion.entity";
import { Huesped } from "../../domain/entities/huesped.entity";
import { TipoHabitacion } from "../../domain/entities/tipo-habitacion.entity";
import type { IEstanciaRepository, UpdateEstanciaData } from "../../domain/interfaces/estancia.repository.interface";
import { EstanciaException } from "../../domain/exceptions/estancia.exception";
import { DI_TOKENS } from "../../common/IoC/tokens";

@injectable()
export class EstanciaRepository implements IEstanciaRepository {
  constructor(@inject(DI_TOKENS.PrismaClient) private prisma: PrismaClient) {}

  async create(data: CreateEstanciaData): Promise<Estancia> {
    // Validar que existan las entidades relacionadas
    const reserva = await this.prisma.reserva.findUnique({
      where: { id: data.reservaId },
    });
    if (!reserva) {
      throw EstanciaException.reservaNotFound();
    }

    const habitacion = await this.prisma.habitacion.findUnique({
      where: { id: data.habitacionId },
    });
    if (!habitacion) {
      throw EstanciaException.habitacionNotFound();
    }

    const huesped = await this.prisma.huesped.findUnique({
      where: { id: data.huespedId },
    });
    if (!huesped) {
      throw EstanciaException.huespedNotFound();
    }

    // Validar fechas si se proporcionan ambas
    if (data.fechaSalida && data.fechaEntrada && data.fechaSalida <= data.fechaEntrada) {
      throw EstanciaException.invalidDateRange();
    }

    const result = await this.prisma.estancia.create({
      data: {
        reservaId: data.reservaId,
        habitacionId: data.habitacionId,
        huespedId: data.huespedId,
        fechaEntrada: data.fechaEntrada || new Date(),
        fechaSalida: data.fechaSalida || null,
        estado: data.estado || "EN_CASA",
        notas: data.notas || null,
      },
      include: this.getIncludeRelations(),
    });

    return this.toDomain(result);
  }

  async findAll(): Promise<Estancia[]> {
    const results = await this.prisma.estancia.findMany({
      include: this.getIncludeRelations(),
      orderBy: { createdAt: "desc" },
    });
    return results.map((r) => this.toDomain(r));
  }

  async findById(id: string): Promise<Estancia | null> {
    const result = await this.prisma.estancia.findUnique({
      where: { id },
      include: this.getIncludeRelations(),
    });
    return result ? this.toDomain(result) : null;
  }

  async findByReservaId(reservaId: string): Promise<Estancia[]> {
    const results = await this.prisma.estancia.findMany({
      where: { reservaId },
      include: this.getIncludeRelations(),
      orderBy: { createdAt: "desc" },
    });
    return results.map((r) => this.toDomain(r));
  }

  async update(id: string, data: UpdateEstanciaData): Promise<Estancia> {
    try {
      const existing = await this.prisma.estancia.findUnique({
        where: { id },
      });

      if (!existing) {
        throw EstanciaException.notFoundById();
      }

      // Verificar si está completada
      if (existing.estado === "COMPLETADA") {
        throw EstanciaException.cannotModifyCompleted();
      }

      // Validar fechas si se proporcionan ambas
      const fechaEntrada = data.fechaEntrada || existing.fechaEntrada;
      const fechaSalida = data.fechaSalida !== undefined ? data.fechaSalida : existing.fechaSalida;

      if (fechaSalida && fechaSalida <= fechaEntrada) {
        throw EstanciaException.invalidDateRange();
      }

      // Validar entidades relacionadas si cambian
      if (data.reservaId) {
        const reserva = await this.prisma.reserva.findUnique({
          where: { id: data.reservaId },
        });
        if (!reserva) {
          throw EstanciaException.reservaNotFound();
        }
      }

      if (data.habitacionId) {
        const habitacion = await this.prisma.habitacion.findUnique({
          where: { id: data.habitacionId },
        });
        if (!habitacion) {
          throw EstanciaException.habitacionNotFound();
        }
      }

      if (data.huespedId) {
        const huesped = await this.prisma.huesped.findUnique({
          where: { id: data.huespedId },
        });
        if (!huesped) {
          throw EstanciaException.huespedNotFound();
        }
      }

      const updateData: any = {};
      if (data.reservaId !== undefined) updateData.reservaId = data.reservaId;
      if (data.habitacionId !== undefined) updateData.habitacionId = data.habitacionId;
      if (data.huespedId !== undefined) updateData.huespedId = data.huespedId;
      if (data.fechaEntrada !== undefined) updateData.fechaEntrada = data.fechaEntrada;
      if (data.fechaSalida !== undefined) updateData.fechaSalida = data.fechaSalida;
      if (data.estado !== undefined) updateData.estado = data.estado;
      if (data.notas !== undefined) updateData.notas = data.notas;

      const result = await this.prisma.estancia.update({
        where: { id },
        data: updateData,
        include: this.getIncludeRelations(),
      });

      return this.toDomain(result);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw EstanciaException.notFoundById();
        }
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.estancia.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw EstanciaException.notFoundById();
        }
      }
      throw error;
    }
  }

  async checkout(id: string, fechaSalida: Date): Promise<Estancia> {
    const existing = await this.prisma.estancia.findUnique({
      where: { id },
    });

    if (!existing) {
      throw EstanciaException.notFoundById();
    }

    if (existing.estado === "COMPLETADA") {
      throw EstanciaException.alreadyCompleted();
    }

    if (fechaSalida <= existing.fechaEntrada) {
      throw EstanciaException.invalidDateRange();
    }

    const result = await this.prisma.estancia.update({
      where: { id },
      data: {
        fechaSalida,
        estado: "COMPLETADA",
      },
      include: this.getIncludeRelations(),
    });

    return this.toDomain(result);
  }

  private getIncludeRelations() {
    return {
      habitacion: {
        include: {
          tipo: true,
        },
      },
      huesped: true,
    };
  }

  private toDomain(data: any): Estancia {
    if (!data.habitacion || !data.huesped) {
      throw new Error("Estancia must include habitacion and huesped relations");
    }

    // Construir TipoHabitacion de la habitación de la estancia
    const tipoHabitacion = new TipoHabitacion(
      data.habitacion.tipo.id,
      data.habitacion.tipo.nombre,
      data.habitacion.tipo.descripcion,
      data.habitacion.tipo.createdAt,
      data.habitacion.tipo.updatedAt,
    );

    // Construir Habitacion de la estancia
    const habitacion = new Habitacion(
      data.habitacion.id,
      data.habitacion.nroHabitacion,
      data.habitacion.tipoHabitacionId,
      tipoHabitacion,
      data.habitacion.piso,
      data.habitacion.tieneDucha,
      data.habitacion.tieneBanio,
      data.habitacion.urlImagen,
      data.habitacion.estado,
      data.habitacion.notas,
      data.habitacion.ultiLimpieza,
      data.habitacion.createdAt,
      data.habitacion.updatedAt,
    );

    // Construir Huesped de la estancia
    const huesped = new Huesped(
      data.huesped.id,
      data.huesped.tipoDoc,
      data.huesped.nroDoc,
      data.huesped.nombres,
      data.huesped.apellidos,
      data.huesped.email,
      data.huesped.telefono,
      data.huesped.nacionalidad,
      data.huesped.observacion,
      data.huesped.createdAt,
      data.huesped.updatedAt,
    );

    return new Estancia(
      data.id,
      data.reservaId,
      habitacion,
      huesped,
      data.fechaEntrada,
      data.fechaSalida,
      data.estado as EstadoEstadia,
      data.notas,
      data.createdAt,
      data.updatedAt,
    );
  }
}
