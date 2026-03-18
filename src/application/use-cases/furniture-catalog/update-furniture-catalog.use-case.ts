import { IFurnitureCatalogRepository } from "../../../domain/interfaces/furniture-catalog.repository.interface";
import { FurnitureCatalogException } from "../../../domain/exceptions/furniture-catalog.exception";
import { UpdateFurnitureCatalogInput, FurnitureCatalogOutput } from "../../dtos/furniture-catalog.dto";

export class UpdateFurnitureCatalogUseCase {
  constructor(private repository: IFurnitureCatalogRepository) {}

  async execute(id: string, input: UpdateFurnitureCatalogInput): Promise<FurnitureCatalogOutput> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw FurnitureCatalogException.notFoundById(id);
    }

    if (input.codigo && input.codigo !== existing.codigo) {
      const duplicate = await this.repository.findByCodigo(input.codigo);
      if (duplicate) {
        throw FurnitureCatalogException.duplicateCodigo(input.codigo);
      }
    }

    const updateData: any = {};
    if (input.codigo !== undefined) updateData.codigo = input.codigo;
    if (input.nombre !== undefined) updateData.nombre = input.nombre;
    if (input.categoria !== undefined) updateData.categoria = input.categoria;
    if (input.imagen_url !== undefined) updateData.imagenUrl = input.imagen_url ?? null;
    if (input.tipo !== undefined) updateData.tipo = input.tipo ?? null;
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
    return updated.toOutput();
  }
}
