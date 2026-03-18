import { IFurnitureCatalogRepository } from "../../../domain/interfaces/furniture-catalog.repository.interface";
import { FurnitureCatalogException } from "../../../domain/exceptions/furniture-catalog.exception";

export class DeleteFurnitureCatalogUseCase {
  constructor(private repository: IFurnitureCatalogRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw FurnitureCatalogException.notFoundById(id);
    }

    await this.repository.delete(id);
  }
}
