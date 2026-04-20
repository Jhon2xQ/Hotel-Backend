import { inject, injectable } from "tsyringe";
import type { IMuebleRepository } from "../../../domain/interfaces/mueble.repository.interface";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import type { UpdateMuebleParams } from "../../../domain/interfaces/mueble.repository.interface";
import { MuebleException } from "../../../domain/exceptions/mueble.exception";
import { UpdateMuebleDto, MuebleDto, toMuebleDto } from "../../dtos/mueble.dto";
import { S3UploadService } from "../../../infrastructure/services/s3-upload.service";
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

    if (input.habitacion_id !== undefined) {
      const isEmpty = typeof input.habitacion_id === "string" && input.habitacion_id === "";
      if (!isEmpty && input.habitacion_id) {
        const habitacion = await this.habitacionRepository.findById(input.habitacion_id);
        if (!habitacion) {
          throw MuebleException.habitacionNotFound();
        }
      }
    }

    const updateData: UpdateMuebleParams = {};
    if (input.codigo !== undefined) updateData.codigo = input.codigo;
    if (input.nombre !== undefined) updateData.nombre = input.nombre;
    if (input.categoria_id !== undefined) updateData.categoriaId = input.categoria_id;

    if (input.imagen !== undefined) {
      const isStringEmpty = typeof input.imagen === "string";
      const isArrayWithFile = Array.isArray(input.imagen) && input.imagen.length > 0;

      if (existing.urlImagen && !isStringEmpty) {
        await S3UploadService.deleteImage(existing.urlImagen);
      }

      if (isArrayWithFile) {
        const files = input.imagen as File[];
        updateData.urlImagen = await S3UploadService.uploadImage(files[0]);
      } else if (isStringEmpty) {
        updateData.urlImagen = null;
      }
    }

    if (input.condicion !== undefined) updateData.condicion = input.condicion;
    if (input.fecha_adquisicion !== undefined) {
      updateData.fechaAdq = input.fecha_adquisicion ? new Date(input.fecha_adquisicion) : null;
    }
    if (input.ultima_revision !== undefined) {
      updateData.ultimaRevision = input.ultima_revision ? new Date(input.ultima_revision) : null;
    }
    if (input.descripcion !== undefined) updateData.descripcion = input.descripcion ?? null;
    if (input.habitacion_id !== undefined) {
      const isEmpty = typeof input.habitacion_id === "string" && input.habitacion_id === "";
      updateData.habitacionId = isEmpty ? null : (input.habitacion_id as string);
    }

    const updated = await this.repository.update(id, updateData);
    return toMuebleDto(updated);
  }
}
