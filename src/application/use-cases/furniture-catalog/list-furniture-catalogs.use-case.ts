import { IFurnitureCatalogRepository } from "../../../domain/interfaces/furniture-catalog.repository.interface";
import { FurnitureCatalogOutput } from "../../dtos/furniture-catalog.dto";

export class ListFurnitureCatalogsUseCase {
  constructor(private repository: IFurnitureCatalogRepository) {}

  async execute(): Promise<FurnitureCatalogOutput[]> {
    const furnitures = await this.repository.findAll();
    return furnitures.map((f) => f.toOutput());
  }
}
