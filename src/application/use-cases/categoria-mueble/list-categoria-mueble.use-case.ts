import { inject, injectable } from "tsyringe";
import type { ICategoriaMuebleRepository } from "../../../domain/interfaces/categoria-mueble.repository.interface";
import { CategoriaMuebleDto, toCategoriaMuebleDto } from "../../dtos/categoria-mueble.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListCategoriaMuebleUseCase {
  constructor(
    @inject(DI_TOKENS.ICategoriaMuebleRepository)
    private readonly repository: ICategoriaMuebleRepository,
  ) {}

  async execute(): Promise<CategoriaMuebleDto[]> {
    const cms = await this.repository.findAll();
    return cms.map((c) => toCategoriaMuebleDto(c));
  }
}
