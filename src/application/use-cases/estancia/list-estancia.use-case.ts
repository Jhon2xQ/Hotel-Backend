import { inject, injectable } from "tsyringe";
import type { IEstanciaRepository } from "../../../domain/interfaces/estancia.repository.interface";
import { EstanciaDto, toEstanciaDto } from "../../dtos/estancia.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListEstanciaUseCase {
  constructor(
    @inject(DI_TOKENS.IEstanciaRepository) private estanciaRepository: IEstanciaRepository,
  ) {}

  async execute(): Promise<EstanciaDto[]> {
    const rows = await this.estanciaRepository.findAll();
    return rows.map((e) => toEstanciaDto(e));
  }
}
