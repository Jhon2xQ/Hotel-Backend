import { inject, injectable } from "tsyringe";
import type { IReservaRepository, ReservaPaginationParams } from "../../../domain/interfaces/reserva.repository.interface";
import type { PaginatedResult } from "../../paginations/api.pagination";
import { ReservaDto, toReservaDto } from "../../dtos/reserva.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListReservaPaginatedUseCase {
  constructor(
    @inject(DI_TOKENS.IReservaRepository) private reservaRepository: IReservaRepository,
  ) {}

  async execute(params: ReservaPaginationParams): Promise<PaginatedResult<ReservaDto>> {
    const result = await this.reservaRepository.findAllPaginated(params);
    return {
      list: result.list.map((r) => toReservaDto(r)),
      pagination: result.pagination,
    };
  }
}
