import { inject, injectable } from "tsyringe";
import { IEstanciaRepository } from "../../../domain/interfaces/estancia.repository.interface";
import { Estancia } from "../../../domain/entities/estancia.entity";
import { CreateEstanciaInput } from "../../dtos/estancia.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class CreateEstanciaUseCase {
  constructor(
    @inject(DI_TOKENS.IEstanciaRepository) private estanciaRepository: IEstanciaRepository,
  ) {}

  async execute(input: CreateEstanciaInput): Promise<Estancia> {
    return await this.estanciaRepository.create({
      reservaId: input.reservaId,
      habitacionId: input.habitacionId,
      huespedId: input.huespedId,
      fechaEntrada: input.fechaEntrada,
      fechaSalida: input.fechaSalida,
      estado: input.estado,
      notas: input.notas,
    });
  }
}
