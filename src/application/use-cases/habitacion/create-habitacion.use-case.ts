import { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import { ITipoHabitacionRepository } from "../../../domain/interfaces/tipo-habitacion.repository.interface";
import { IFurnitureCatalogRepository } from "../../../domain/interfaces/furniture-catalog.repository.interface";
import { HabitacionException } from "../../../domain/exceptions/habitacion.exception";
import { CreateHabitacionInput, HabitacionOutput } from "../../dtos/habitacion.dto";
import { EstadoHabitacion, EstadoLimpieza } from "../../../domain/entities/habitacion.entity";

export class CreateHabitacionUseCase {
  constructor(
    private repository: IHabitacionRepository,
    private tipoHabitacionRepository: ITipoHabitacionRepository,
    private furnitureRepository: IFurnitureCatalogRepository,
  ) {}

  async execute(input: CreateHabitacionInput): Promise<HabitacionOutput> {
    // Validate TipoHabitacion exists (Requirement 6.4)
    const tipoHabitacion = await this.tipoHabitacionRepository.findById(input.tipo_id);
    if (!tipoHabitacion) {
      throw HabitacionException.tipoNotFound(input.tipo_id);
    }

    // Check nroHabitacion uniqueness (Requirement 6.11)
    const existingHabitacion = await this.repository.findByNumero(input.nro_habitacion);
    if (existingHabitacion) {
      throw HabitacionException.duplicateNumero(input.nro_habitacion);
    }

    // Validate all referenced muebles exist (Requirement 6.12)
    if (input.muebles && input.muebles.length > 0) {
      for (const muebleId of input.muebles) {
        const mueble = await this.furnitureRepository.findById(muebleId);
        if (!mueble) {
          throw HabitacionException.muebleNotFound(muebleId);
        }
      }
    }

    // Fetch full mueble data for the entity
    const muebles =
      input.muebles && input.muebles.length > 0
        ? await Promise.all(
            input.muebles.map(async (id) => {
              const mueble = await this.furnitureRepository.findById(id);
              return {
                id: mueble!.id,
                codigo: mueble!.codigo,
                nombre: mueble!.nombre,
                categoria: mueble!.categoria,
              };
            }),
          )
        : [];

    // Create habitacion with defaults (Requirement 6.10, 15.6)
    const habitacion = await this.repository.create({
      nroHabitacion: input.nro_habitacion,
      tipoId: input.tipo_id,
      piso: input.piso,
      urlImagen: input.url_imagen ?? null,
      estado: input.estado ?? EstadoHabitacion.DISPONIBLE,
      limpieza: input.limpieza ?? EstadoLimpieza.LIMPIA,
      notas: input.notas ?? null,
      muebles,
    });

    return habitacion.toOutput();
  }
}
