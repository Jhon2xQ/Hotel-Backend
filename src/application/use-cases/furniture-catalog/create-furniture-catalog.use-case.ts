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

    const furniture = await this.repository.create(input);
    return furniture.toOutput();
  }
}
