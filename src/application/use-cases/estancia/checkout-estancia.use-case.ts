import { inject, injectable } from "tsyringe";
import type { IEstanciaRepository } from "../../../domain/interfaces/estancia.repository.interface";
import { EstanciaException } from "../../../domain/exceptions/estancia.exception";
import { EstadoEstadia } from "../../../domain/entities/estancia.entity";
import { CheckoutEstanciaDto, EstanciaDto, toEstanciaDto } from "../../dtos/estancia.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class CheckoutEstanciaUseCase {
  constructor(
    @inject(DI_TOKENS.IEstanciaRepository) private estanciaRepository: IEstanciaRepository,
  ) {}

  async execute(id: string, input: CheckoutEstanciaDto): Promise<EstanciaDto> {
    const existing = await this.estanciaRepository.findById(id);
    if (!existing) {
      throw EstanciaException.notFoundById(id);
    }

    if (existing.estado === EstadoEstadia.COMPLETADA) {
      throw EstanciaException.alreadyCompleted();
    }

    if (input.fechaSalida <= existing.fechaEntrada) {
      throw EstanciaException.invalidDateRange();
    }

    const estancia = await this.estanciaRepository.checkout(id, input.fechaSalida);
    return toEstanciaDto(estancia);
  }
}
