import { CategoriaMueble } from "../../../domain/entities/categoria-mueble.entity";
import { CategoriaMuebleException } from "../../../domain/exceptions/categoria-mueble.exception";
import { ICategoriaMuebleRepository, UpdateCategoriaMuebleData } from "../../../domain/interfaces/categoria-mueble.repository.interface";

export class UpdateCategoriaMuebleUseCase {
    constructor(private readonly repository: ICategoriaMuebleRepository) {}

    async execute(id: string, data: UpdateCategoriaMuebleData): Promise<CategoriaMueble> {

        const existingCM = await this.repository.findById(id);
        if (!existingCM) {
            throw CategoriaMuebleException.notFoundById(id);
        }
        return await this.repository.update(id, data);
    }
}