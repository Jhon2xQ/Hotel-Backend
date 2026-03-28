import { inject, injectable } from "tsyringe";
import { CategoriaMuebleException } from "../../../domain/exceptions/categoria-mueble.exception";
import type { ICategoriaMuebleRepository } from "../../../domain/interfaces/categoria-mueble.repository.interface";
import { CategoriaMuebleDto, toCategoriaMuebleDto } from "../../dtos/categoria-mueble.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class FindCategoriaMuebleUseCase {
  constructor(
    @inject(DI_TOKENS.ICategoriaMuebleRepository)
    private readonly categoriaMuebleRepository: ICategoriaMuebleRepository,
  ) {}

  async execute(id: string): Promise<CategoriaMuebleDto> {
    const cm = await this.categoriaMuebleRepository.findById(id);
    if (!cm) {
      throw CategoriaMuebleException.notFoundById(id);
    }
    return toCategoriaMuebleDto(cm);
  }
}
