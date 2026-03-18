import { IFurnitureCatalogRepository } from "../../../domain/interfaces/furniture-catalog.repository.interface";
import { FurnitureCatalogException } from "../../../domain/exceptions/furniture-catalog.exception";
import { CreateFurnitureCatalogInput, FurnitureCatalogOutput } from "../../dtos/furniture-catalog.dto";

export class CreateFurnitureCatalogUseCase {
  constructor(private repository: IFurnitureCatalogRepository) {}

  async execute(input: CreateFurnitureCatalogInput): Promise<FurnitureCatalogOutput> {
    const existing = await this.repository.findByCodigo(input.codigo);
    if (existing) {
      throw FurnitureCatalogException.duplicateCodigo(input.codigo);
    }

    const furniture = await this.repository.create({
      codigo: input.codigo,
      nombre: input.nombre,
      categoria: input.categoria,
      imagenUrl: input.imagen_url ?? null,
      tipo: input.tipo ?? null,
      condicion: input.condicion,
      fechaAdq: input.fecha_adquisicion ? new Date(input.fecha_adquisicion) : null,
      ultimaRevision: input.ultima_revision ? new Date(input.ultima_revision) : null,
      descripcion: input.descripcion ?? null,
    });
    return furniture.toOutput();
  }
}
