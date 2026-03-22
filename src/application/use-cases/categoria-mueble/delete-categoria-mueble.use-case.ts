import { ICategoriaMuebleRepository } from "../../../domain/interfaces/categoria-mueble.repository.interface";

export class DeleteCategoriaMuebleUseCase {
    constructor(
        private readonly categoriaMuebleRepository: ICategoriaMuebleRepository,
    ) {}

    async execute(id: string): Promise<void> {
        await this.categoriaMuebleRepository.delete(id);
    }
}