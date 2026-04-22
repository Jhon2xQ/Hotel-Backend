import { inject, injectable } from "tsyringe";
import { CategoriaMuebleException } from "../../../domain/exceptions/categoria-mueble.exception";
import type { ICategoriaMuebleRepository } from "../../../domain/interfaces/categoria-mueble.repository.interface";
import {
  CreateCategoriaMuebleDto,
  CategoriaMuebleDto,
  toCategoriaMuebleDto,
} from "../../dtos/categoria-mueble.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class CreateCategoriaMuebleUseCase {
  constructor(
    @inject(DI_TOKENS.ICategoriaMuebleRepository)
    private readonly categoriaMuebleRepository: ICategoriaMuebleRepository,
  ) {}

  async execute(data: CreateCategoriaMuebleDto): Promise<CategoriaMuebleDto> {
    const existingCM = await this.categoriaMuebleRepository.findByName(data.nombre);
    if (existingCM) {
      throw CategoriaMuebleException.duplicateNombre(data.nombre);
    }
    const created = await this.categoriaMuebleRepository.create({
      nombre: data.nombre,
    });
    return toCategoriaMuebleDto(created);
  }
}
