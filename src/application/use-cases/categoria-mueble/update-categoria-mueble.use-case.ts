import { inject, injectable } from "tsyringe";
import { CategoriaMueble } from "../../../domain/entities/categoria-mueble.entity";
import { CategoriaMuebleException } from "../../../domain/exceptions/categoria-mueble.exception";
import type { ICategoriaMuebleRepository, UpdateCategoriaMuebleData } from "../../../domain/interfaces/categoria-mueble.repository.interface";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class UpdateCategoriaMuebleUseCase {
    constructor(
        @inject(DI_TOKENS.ICategoriaMuebleRepository)
        private readonly repository: ICategoriaMuebleRepository,
    ) {}

    async execute(id: string, data: UpdateCategoriaMuebleData): Promise<CategoriaMueble> {

        const existingCM = await this.repository.findById(id);
        if (!existingCM) {
            throw CategoriaMuebleException.notFoundById(id);
        }
        return await this.repository.update(id, data);
    }
}