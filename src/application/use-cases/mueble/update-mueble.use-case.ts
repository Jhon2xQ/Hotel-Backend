import { inject, injectable } from "tsyringe";
import type { IMuebleRepository } from "../../../domain/interfaces/mueble.repository.interface";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import type { UpdateMuebleParams } from "../../../domain/interfaces/mueble.repository.interface";
import { MuebleException } from "../../../domain/exceptions/mueble.exception";
import { UpdateMuebleDto, MuebleDto, toMuebleDto } from "../../dtos/mueble.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class UpdateMuebleUseCase {
  constructor(
    @inject(DI_TOKENS.IMuebleRepository) private repository: IMuebleRepository,
    @inject(DI_TOKENS.IHabitacionRepository) private habitacionRepository: IHabitacionRepository,
  ) {}

  async execute(id: string, input: UpdateMuebleDto): Promise<MuebleDto> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw MuebleException.notFoundById();
    }

    if (input.codigo && input.codigo !== existing.codigo) {
      const duplicate = await this.repository.findByCodigo(input.codigo);
      if (duplicate) {
        throw MuebleException.duplicateCodigo();
      }
    }

    if (input.habitacion_id !== undefined && input.habitacion_id !== null) {
      const habitacion = await this.habitacionRepository.findById(input.habitacion_id);
      if (!habitacion) {
        throw MuebleException.habitacionNotFound();
      }
    }

    const updateData: UpdateMuebleParams = {};
    if (input.codigo !== undefined) updateData.codigo = input.codigo;
    if (input.nombre !== undefined) updateData.nombre = input.nombre;
    if (input.categoria_id !== undefined) updateData.categoriaId = input.categoria_id;
    if (input.imagen_url !== undefined) updateData.imagenUrl = input.imagen_url ?? null;
    if (input.condicion !== undefined) updateData.condicion = input.condicion;
    if (input.fecha_adquisicion !== undefined) {
      updateData.fechaAdq = input.fecha_adquisicion ? new Date(input.fecha_adquisicion) : null;
    }
    if (input.ultima_revision !== undefined) {
      updateData.ultimaRevision = input.ultima_revision ? new Date(input.ultima_revision) : null;
    }
    if (input.descripcion !== undefined) updateData.descripcion = input.descripcion ?? null;
    if (input.habitacion_id !== undefined) updateData.habitacionId = input.habitacion_id ?? null;

    const updated = await this.repository.update(id, updateData);
    return toMuebleDto(updated);
  }
}
