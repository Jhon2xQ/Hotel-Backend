import { IHuespedRepository } from "../../../domain/interfaces/huesped.repository.interface";

export class DeleteHuespedUseCase {
  constructor(private readonly repository: IHuespedRepository) {}

  async execute(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
