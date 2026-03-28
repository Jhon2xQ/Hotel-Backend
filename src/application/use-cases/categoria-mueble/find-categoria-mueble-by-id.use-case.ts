import { inject, injectable } from "tsyringe";
import { CategoriaMueble } from "../../../domain/entities/categoria-mueble.entity";
import { CategoriaMuebleException } from "../../../domain/exceptions/categoria-mueble.exception";
import { ICategoriaMuebleRepository } from "../../../domain/interfaces/categoria-mueble.repository.interface";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class FindCategoriaMuebleUseCase {
    constructor(
        @inject(DI_TOKENS.ICategoriaMuebleRepository)
        private readonly categoriaMuebleRepository: ICategoriaMuebleRepository,
    ) {}

    async execute(id: string): Promise<CategoriaMueble> {
        const cm = await this.categoriaMuebleRepository.findById(id);
        if (!cm) {
            throw CategoriaMuebleException.notFoundById(id);
        }
        return cm;
    }
}