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

    const updated = await this.repository.update(id, input);
    return updated.toOutput();
  }
}
