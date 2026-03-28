import { inject, injectable } from "tsyringe";
import { CategoriaMuebleException } from "../../../domain/exceptions/categoria-mueble.exception";
import type { ICategoriaMuebleRepository } from "../../../domain/interfaces/categoria-mueble.repository.interface";
import {
  UpdateCategoriaMuebleDto,
  CategoriaMuebleDto,
  toCategoriaMuebleDto,
} from "../../dtos/categoria-mueble.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class UpdateCategoriaMuebleUseCase {
  constructor(
    @inject(DI_TOKENS.ICategoriaMuebleRepository)
    private readonly repository: ICategoriaMuebleRepository,
  ) {}

  async execute(id: string, data: UpdateCategoriaMuebleDto): Promise<CategoriaMuebleDto> {
    const existingCM = await this.repository.findById(id);
    if (!existingCM) {
      throw CategoriaMuebleException.notFoundById(id);
    }

    if (data.nombre !== undefined && data.nombre !== existingCM.nombre) {
      const byName = await this.repository.findByName(data.nombre);
      if (byName) {
        throw CategoriaMuebleException.duplicateNombre(data.nombre);
      }
    }

    const updated = await this.repository.update(id, {
      nombre: data.nombre,
      descripcion: data.descripcion,
      activo: data.activo,
    });
    return toCategoriaMuebleDto(updated);
  }
}
