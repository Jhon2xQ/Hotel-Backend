import { IEstanciaRepository } from "../../../domain/interfaces/estancia.repository.interface";
import { Estancia } from "../../../domain/entities/estancia.entity";
import { CreateEstanciaInput } from "../../dtos/estancia.dto";

export class CreateEstanciaUseCase {
  constructor(private estanciaRepository: IEstanciaRepository) {}

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
