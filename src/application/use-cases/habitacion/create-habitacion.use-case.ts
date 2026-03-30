import { inject, injectable } from "tsyringe";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import type { ITipoHabitacionRepository } from "../../../domain/interfaces/tipo-habitacion.repository.interface";
import { HabitacionException } from "../../../domain/exceptions/habitacion.exception";
import { CreateHabitacionDto, HabitacionDto, toHabitacionDto } from "../../dtos/habitacion.dto";
import { S3UploadService } from "../../../infrastructure/services/s3-upload.service";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class CreateHabitacionUseCase {
  constructor(
    @inject(DI_TOKENS.IHabitacionRepository) private repository: IHabitacionRepository,
    @inject(DI_TOKENS.ITipoHabitacionRepository)
    private tipoHabitacionRepository: ITipoHabitacionRepository,
  ) {}

  async execute(input: CreateHabitacionDto): Promise<HabitacionDto> {
    const tipoHabitacion = await this.tipoHabitacionRepository.findById(input.tipo_habitacion_id);
    if (!tipoHabitacion) {
      throw HabitacionException.tipoNotFound();
    }

    const existingHabitacion = await this.repository.findByNumero(input.nro_habitacion);
    if (existingHabitacion) {
      throw HabitacionException.duplicateNumero();
    }

    let imageUrls: string[] | null = null;
    if (input.imagenes && input.imagenes.length > 0) {
      imageUrls = await S3UploadService.uploadImages(input.imagenes);
    }

    const habitacion = await this.repository.create({
      nroHabitacion: input.nro_habitacion,
      tipoHabitacionId: input.tipo_habitacion_id,
      piso: input.piso,
      tieneDucha: input.tiene_ducha ?? false,
      tieneBanio: input.tiene_banio ?? false,
      urlImagen: imageUrls,
      estado: input.estado ?? false,
      descripcion: input.descripcion ?? null,
    });

    return toHabitacionDto(habitacion);
  }
}
