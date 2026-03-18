import { ITipoHabitacionRepository } from "../../../domain/interfaces/tipo-habitacion.repository.interface";
import { IFurnitureCatalogRepository } from "../../../domain/interfaces/furniture-catalog.repository.interface";
import { TipoHabitacionException } from "../../../domain/exceptions/tipo-habitacion.exception";
import { CreateTipoHabitacionInput, TipoHabitacionOutput } from "../../dtos/tipo-habitacion.dto";

export class CreateTipoHabitacionUseCase {
  constructor(
    private repository: ITipoHabitacionRepository,
    private furnitureRepository: IFurnitureCatalogRepository,
  ) {}

  async execute(input: CreateTipoHabitacionInput): Promise<TipoHabitacionOutput> {
    // Validate all referenced muebles exist (if provided)
    if (input.muebles && input.muebles.length > 0) {
      for (const muebleId of input.muebles) {
        const mueble = await this.furnitureRepository.findById(muebleId);
        if (!mueble) {
          throw TipoHabitacionException.muebleNotFound(muebleId);
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

    const tipoHabitacion = await this.repository.create({
      nombre: input.nombre,
      descripcion: input.descripcion ?? null,
      tieneDucha: input.tiene_ducha,
      tieneBanio: input.tiene_banio,
      muebles,
    });

    return tipoHabitacion.toOutput();
  }
}
