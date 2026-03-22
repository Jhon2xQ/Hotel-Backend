import { CategoriaMueble } from "../../../domain/entities/categoria-mueble.entity";
import { ICategoriaMuebleRepository, UpdateCategoriaMuebleData } from "../../../domain/interfaces/categoria-mueble.repository.interface";

export class UpdateCategoriaMuebleUseCase {
    constructor(private readonly repository: ICategoriaMuebleRepository) {}

    async execute(id: string, data: UpdateCategoriaMuebleData): Promise<CategoriaMueble> {
        return await this.repository.update(id, data);
    }
}