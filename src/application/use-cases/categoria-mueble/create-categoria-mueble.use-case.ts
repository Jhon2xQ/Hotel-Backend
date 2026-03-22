import { CategoriaMueble, CreateCategoriaMuebleData } from "../../../domain/entities/categoria-mueble.entity";
import { ICategoriaMuebleRepository } from "../../../domain/interfaces/categoria-mueble.repository.interface";

export class CreateCategoriaMuebleUseCase {
    constructor(
        private readonly categoriaMuebleRepository: ICategoriaMuebleRepository,
    ) {}

    async execute(data: CreateCategoriaMuebleData): Promise<CategoriaMueble> {
        return await this.categoriaMuebleRepository.create(data);
    }
}