import { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import { ITipoHabitacionRepository } from "../../../domain/interfaces/tipo-habitacion.repository.interface";
import { IFurnitureCatalogRepository } from "../../../domain/interfaces/furniture-catalog.repository.interface";
import { HabitacionException } from "../../../domain/exceptions/habitacion.exception";
import { UpdateHabitacionInput, HabitacionOutput } from "../../dtos/habitacion.dto";
import type { CatalogoMueble } from "../../../domain/entities/tipo-habitacion.entity";

export class UpdateHabitacionUseCase {
  constructor(
    private repository: IHabitacionRepository,
    private tipoHabitacionRepository: ITipoHabitacionRepository,
    private furnitureRepository: IFurnitureCatalogRepository,
  ) {}

  async execute(id: string, input: UpdateHabitacionInput): Promise<HabitacionOutput> {
    // Validate Habitacion exists (Requirement 9.1, 9.10)
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw HabitacionException.notFoundById();
    }

    // If nroHabitacion is being changed, check uniqueness (Requirement 9.4, 9.5)
    if (input.nro_habitacion !== undefined && input.nro_habitacion !== existing.nroHabitacion) {
      const existingWithNumero = await this.repository.findByNumero(input.nro_habitacion);
      if (existingWithNumero) {
        throw HabitacionException.duplicateNumero();
      }
    }

    // If tipoId is being changed, validate TipoHabitacion exists (Requirement 9.4)
    if (input.tipo_id !== undefined) {
      const tipoHabitacion = await this.tipoHabitacionRepository.findById(input.tipo_id);
      if (!tipoHabitacion) {
        throw HabitacionException.tipoNotFound();
      }
    }

    // Validate all referenced muebles exist (if provided) (Requirement 9.4)
    if (input.muebles !== undefined && input.muebles.length > 0) {
      for (const muebleId of input.muebles) {
        const mueble = await this.furnitureRepository.findById(muebleId);
        if (!mueble) {
          throw HabitacionException.muebleNotFound();
        }
      }
    }

    // Fetch full mueble data for the entity (if muebles are being updated)
    let muebles: CatalogoMueble[] | undefined;
    if (input.muebles !== undefined) {
      if (input.muebles.length > 0) {
        muebles = await Promise.all(
          input.muebles.map(async (id) => {
            const mueble = await this.furnitureRepository.findById(id);
            return {
              id: mueble!.id,
              codigo: mueble!.codigo,
              nombre: mueble!.nombre,
              categoria: mueble!.categoria,
            };
          }),
        );
      } else {
        muebles = [];
      }
    }

    // Call repository.update and return HabitacionOutput (Requirement 15.9)
    // If estado changes to LIMPIEZA, set ultimaLimpieza to current timestamp (Requirement 9.8)
    const updated = await this.repository.update(id, {
      nroHabitacion: input.nro_habitacion,
      tipoId: input.tipo_id,
      piso: input.piso,
      tieneDucha: input.tiene_ducha,
      tieneBanio: input.tiene_banio,
      urlImagen: input.url_imagen,
      estado: input.estado,
      limpieza: input.limpieza,
      notas: input.notas,
      muebles,
    });

    return updated.toOutput();
  }
}
