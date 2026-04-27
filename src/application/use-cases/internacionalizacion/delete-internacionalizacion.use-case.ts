import { inject, injectable } from "tsyringe";
import type { IInternacionalizacionRepository } from "../../../domain/interfaces/internacionalizacion.repository.interface";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class DeleteInternacionalizacionUseCase {
  constructor(
    @inject(DI_TOKENS.IInternacionalizacionRepository) private repository: IInternacionalizacionRepository,
  ) {}

  async execute(habitacionId: string): Promise<void> {
    await this.repository.delete(habitacionId);
  }
}