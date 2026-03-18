import { ITipoHabitacionRepository } from "../../../domain/interfaces/tipo-habitacion.repository.interface";
import { IFurnitureCatalogRepository } from "../../../domain/interfaces/furniture-catalog.repository.interface";
import { TipoHabitacionException } from "../../../domain/exceptions/tipo-habitacion.exception";
import { UpdateTipoHabitacionInput, TipoHabitacionOutput } from "../../dtos/tipo-habitacion.dto";

export class UpdateTipoHabitacionUseCase {
  constructor(
    private repository: ITipoHabitacionRepository,
    private furnitureRepository: IFurnitureCatalogRepository,
  ) {}

  async execute(id: string, input: UpdateTipoHabitacionInput): Promise<TipoHabitacionOutput> {
    // Validate TipoHabitacion exists
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw TipoHabitacionException.notFoundById(id);
    }

    // Validate all referenced muebles exist (if provided)
    if (input.muebles && input.muebles.length > 0) {
      for (const muebleId of input.muebles) {
        const mueble = await this.furnitureRepository.findById(muebleId);
        if (!mueble) {
          throw TipoHabitacionException.muebleNotFound(muebleId);
        }
      }
    }

    // Fetch full mueble data for the entity (if muebles are being updated)
    const muebles =
      input.muebles !== undefined
        ? input.muebles.length > 0
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
          : []
        : undefined;

    // Call repository.update and return TipoHabitacionOutput
    const updated = await this.repository.update(id, {
      nombre: input.nombre,
      descripcion: input.descripcion,
      tieneDucha: input.tiene_ducha,
      tieneBanio: input.tiene_banio,
      muebles,
    });

    return updated.toOutput();
  }
}
