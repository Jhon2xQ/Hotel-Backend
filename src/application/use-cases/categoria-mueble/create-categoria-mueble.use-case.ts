import { inject, injectable } from "tsyringe";
import { CategoriaMueble, CreateCategoriaMuebleData } from "../../../domain/entities/categoria-mueble.entity";
import { CategoriaMuebleException } from "../../../domain/exceptions/categoria-mueble.exception";
import type { ICategoriaMuebleRepository } from "../../../domain/interfaces/categoria-mueble.repository.interface";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class CreateCategoriaMuebleUseCase {
    constructor(
        @inject(DI_TOKENS.ICategoriaMuebleRepository)
        private readonly categoriaMuebleRepository: ICategoriaMuebleRepository,
    ) {}

    async execute(data: CreateCategoriaMuebleData): Promise<CategoriaMueble> {
        
        const existingCM = await this.categoriaMuebleRepository.findByName(data.nombre);
        if (existingCM) {
            throw CategoriaMuebleException.duplicateNombre(data.nombre);
        }
        return await this.categoriaMuebleRepository.create(data);
    }
}