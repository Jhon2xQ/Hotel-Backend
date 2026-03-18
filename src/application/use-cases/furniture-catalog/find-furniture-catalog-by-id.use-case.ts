import { IFurnitureCatalogRepository } from "../../../domain/interfaces/furniture-catalog.repository.interface";
import { FurnitureCatalogException } from "../../../domain/exceptions/furniture-catalog.exception";
import { FurnitureCatalogOutput } from "../../dtos/furniture-catalog.dto";

export class FindFurnitureCatalogByIdUseCase {
  constructor(private repository: IFurnitureCatalogRepository) {}

  async execute(id: string): Promise<FurnitureCatalogOutput> {
    const furniture = await this.repository.findById(id);
    if (!furniture) {
      throw FurnitureCatalogException.notFoundById(id);
    }
    return furniture.toOutput();
  }
}
