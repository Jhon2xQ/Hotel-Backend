import { inject, injectable } from "tsyringe";
import { CategoriaMueble } from "../../../domain/entities/categoria-mueble.entity";
import { ICategoriaMuebleRepository } from "../../../domain/interfaces/categoria-mueble.repository.interface";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListCategoriaMuebleUseCase {
    constructor(
        @inject(DI_TOKENS.ICategoriaMuebleRepository)
        private readonly repository: ICategoriaMuebleRepository,
    ) {}

    async execute(): Promise<CategoriaMueble[]> {
        const cms = await this.repository.findAll();
        return cms;
    }
}
