import { inject, injectable } from "tsyringe";
import type { IHuespedRepository } from "../../../domain/interfaces/huesped.repository.interface";
import { HuespedException } from "../../../domain/exceptions/huesped.exception";
import { UpdateHuespedDto, HuespedDto, toHuespedDto } from "../../dtos/huesped.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class UpdateHuespedUseCase {
  constructor(@inject(DI_TOKENS.IHuespedRepository) private readonly repository: IHuespedRepository) {}

  async execute(id: string, data: UpdateHuespedDto): Promise<HuespedDto> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw HuespedException.notFoundById(id);
    }

    if (data.email && data.email !== existing.email) {
      const emailExists = await this.repository.findByEmail(data.email);

      if (emailExists) {
        throw HuespedException.duplicateEmail(data.email);
      }
    }

    const huesped = await this.repository.update(id, {
      tipo_doc: data.tipo_doc,
      nro_doc: data.nro_doc,
      nombres: data.nombres,
      apellidos: data.apellidos,
      email: data.email,
      telefono: data.telefono,
      nacionalidad: data.nacionalidad,
      observacion: data.observacion,
    });

    return toHuespedDto(huesped);
  }
}
