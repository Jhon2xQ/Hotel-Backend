import { inject, injectable } from "tsyringe";
import { ICategoriaMuebleRepository } from "../../../domain/interfaces/categoria-mueble.repository.interface";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class DeleteCategoriaMuebleUseCase {
    constructor(
        @inject(DI_TOKENS.ICategoriaMuebleRepository)
        private readonly categoriaMuebleRepository: ICategoriaMuebleRepository,
    ) {}

    async execute(id: string): Promise<void> {
        await this.categoriaMuebleRepository.delete(id);
    }
}