import { inject, injectable } from "tsyringe";
import type { IHuespedRepository } from "../../../domain/interfaces/huesped.repository.interface";
import { HuespedException } from "../../../domain/exceptions/huesped.exception";
import { CreateHuespedDto, HuespedDto, toHuespedDto } from "../../dtos/huesped.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class CreateHuespedUseCase {
  constructor(@inject(DI_TOKENS.IHuespedRepository) private readonly repository: IHuespedRepository) {}

  async execute(data: CreateHuespedDto): Promise<HuespedDto> {
    const existing = await this.repository.findByEmail(data.email);

    if (existing) {
      throw HuespedException.duplicateEmail(data.email);
    }

    const huesped = await this.repository.create({
      tipo_doc: data.tipo_doc ?? null,
      nro_doc: data.nro_doc ?? null,
      nombres: data.nombres,
      apellidos: data.apellidos,
      email: data.email,
      telefono: data.telefono,
      nacionalidad: data.nacionalidad,
      observacion: data.observacion ?? null,
    });

    return toHuespedDto(huesped);
  }
}
