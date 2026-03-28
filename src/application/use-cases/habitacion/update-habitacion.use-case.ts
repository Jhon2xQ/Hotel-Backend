import { inject, injectable } from "tsyringe";
import { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import { ITipoHabitacionRepository } from "../../../domain/interfaces/tipo-habitacion.repository.interface";
import { IMuebleRepository } from "../../../domain/interfaces/mueble.repository.interface";
import { HabitacionException } from "../../../domain/exceptions/habitacion.exception";
import { UpdateHabitacionInput, HabitacionOutput } from "../../dtos/habitacion.dto";
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
    if (input.tipo_habitacion_id !== undefined) {
      const tipoHabitacion = await this.tipoHabitacionRepository.findById(input.tipo_habitacion_id);
      if (!tipoHabitacion) {
        throw HabitacionException.tipoNotFound();
      }
    }

    // Upload images to S3 if provided
    let imageUrls: string[] | undefined = undefined;
    if (input.imagenes && input.imagenes.length > 0) {
      imageUrls = await S3UploadService.uploadImages(input.imagenes);
    }

    // Call repository.update and return HabitacionOutput (Requirement 15.9)
    // If estado changes to LIMPIEZA, set ultimaLimpieza to current timestamp (Requirement 9.8)
    const updated = await this.repository.update(id, {
      nroHabitacion: input.nro_habitacion,
      tipoHabitacionId: input.tipo_habitacion_id,
      piso: input.piso,
      tieneDucha: input.tiene_ducha,
      tieneBanio: input.tiene_banio,
      urlImagen: imageUrls,
      estado: input.estado,
      notas: input.notas,
      ultiLimpieza: input.ulti_limpieza ? new Date(input.ulti_limpieza) : null,
    });

    return updated.toOutput();
  }
}
