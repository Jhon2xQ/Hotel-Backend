import { CategoriaMueble } from "../../../domain/entities/categoria-mueble.entity";
import { ICategoriaMuebleRepository } from "../../../domain/interfaces/categoria-mueble.repository.interface";

export class ListCategoriaMuebleUseCase {
    constructor(private readonly repository: ICategoriaMuebleRepository) {}

    async execute(): Promise<CategoriaMueble[]> {
        const cms = await this.repository.findAll();
        return cms;
    }
}
