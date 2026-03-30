import { inject, injectable } from "tsyringe";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import type { ITipoHabitacionRepository } from "../../../domain/interfaces/tipo-habitacion.repository.interface";
import type { IMuebleRepository } from "../../../domain/interfaces/mueble.repository.interface";
import { HabitacionException } from "../../../domain/exceptions/habitacion.exception";
import { UpdateHabitacionDto, HabitacionDto, toHabitacionDto } from "../../dtos/habitacion.dto";
import { S3UploadService } from "../../../infrastructure/services/s3-upload.service";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class UpdateHabitacionUseCase {
  constructor(
    @inject(DI_TOKENS.IHabitacionRepository) private repository: IHabitacionRepository,
    @inject(DI_TOKENS.ITipoHabitacionRepository)
    private tipoHabitacionRepository: ITipoHabitacionRepository,
    @inject(DI_TOKENS.IMuebleRepository) private furnitureRepository: IMuebleRepository,
  ) {}

  async execute(id: string, input: UpdateHabitacionDto): Promise<HabitacionDto> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw HabitacionException.notFoundById();
    }

    if (input.nro_habitacion !== undefined && input.nro_habitacion !== existing.nroHabitacion) {
      const existingWithNumero = await this.repository.findByNumero(input.nro_habitacion);
      if (existingWithNumero) {
        throw HabitacionException.duplicateNumero();
      }
    }

    if (input.tipo_habitacion_id !== undefined) {
      const tipoHabitacion = await this.tipoHabitacionRepository.findById(input.tipo_habitacion_id);
      if (!tipoHabitacion) {
        throw HabitacionException.tipoNotFound();
      }
    }

    let imageUrls: string[] | undefined = undefined;
    if (input.imagenes && input.imagenes.length > 0) {
      imageUrls = await S3UploadService.uploadImages(input.imagenes);
    }

    const updated = await this.repository.update(id, {
      nroHabitacion: input.nro_habitacion,
      tipoHabitacionId: input.tipo_habitacion_id,
      piso: input.piso,
      tieneDucha: input.tiene_ducha,
      tieneBanio: input.tiene_banio,
      urlImagen: imageUrls,
      estado: input.estado,
      descripcion: input.descripcion,
    });

    return toHabitacionDto(updated);
  }
}
