import { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import { ITipoHabitacionRepository } from "../../../domain/interfaces/tipo-habitacion.repository.interface";
import { HabitacionException } from "../../../domain/exceptions/habitacion.exception";
import { CreateHabitacionInput, HabitacionOutput } from "../../dtos/habitacion.dto";
import { EstadoHabitacion } from "../../../domain/entities/habitacion.entity";
import { S3UploadService } from "../../../infrastructure/services/s3-upload.service";

export class CreateHabitacionUseCase {
  constructor(
    private repository: IHabitacionRepository,
    private tipoHabitacionRepository: ITipoHabitacionRepository,
  ) {}

  async execute(input: CreateHabitacionInput): Promise<HabitacionOutput> {
    // Validate TipoHabitacion exists (Requirement 6.4)
    const tipoHabitacion = await this.tipoHabitacionRepository.findById(input.tipo_habitacion_id);
    if (!tipoHabitacion) {
      throw HabitacionException.tipoNotFound();
    }

    // Check nroHabitacion uniqueness (Requirement 6.11)
    const existingHabitacion = await this.repository.findByNumero(input.nro_habitacion);
    if (existingHabitacion) {
      throw HabitacionException.duplicateNumero();
    }

    // Upload images to S3 if provided
    let imageUrls: string[] | null = null;
    if (input.imagenes && input.imagenes.length > 0) {
      imageUrls = await S3UploadService.uploadImages(input.imagenes);
    }

    // Create habitacion with defaults (Requirement 6.10, 15.6)
    const habitacion = await this.repository.create({
      nroHabitacion: input.nro_habitacion,
      tipoHabitacionId: input.tipo_habitacion_id,
      piso: input.piso,
      tieneDucha: input.tiene_ducha ?? false,
      tieneBanio: input.tiene_banio ?? false,
      urlImagen: imageUrls,
      estado: input.estado ?? EstadoHabitacion.DISPONIBLE,
      notas: input.notas ?? null,
      ultiLimpieza: input.ulti_limpieza ? new Date(input.ulti_limpieza) : null,
    });

    return habitacion.toOutput();
  }
}
