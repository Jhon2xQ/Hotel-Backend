import { container } from "tsyringe";
import type { PrismaClient } from "../../../generated/prisma/client";
import { DI_TOKENS } from "./tokens";

import { MuebleRepository } from "../../infrastructure/repositories/mueble.repository";
import { HabitacionRepository } from "../../infrastructure/repositories/habitacion.repository";
import { TipoHabitacionRepository } from "../../infrastructure/repositories/tipo-habitacion.repository";
import { ReservaRepository } from "../../infrastructure/repositories/reserva.repository";
import { HuespedRepository } from "../../infrastructure/repositories/huesped.repository";
import { TarifaRepository } from "../../infrastructure/repositories/tarifa.repository";
import { PagoRepository } from "../../infrastructure/repositories/pago.repository";
import { UserRepository } from "../../infrastructure/repositories/user.repository";
import { EstanciaRepository } from "../../infrastructure/repositories/estancia.repository";
import { CanalRepository } from "../../infrastructure/repositories/canal.repository";
import { CategoriaMuebleRepository } from "../../infrastructure/repositories/categoria-mueble.repository";

import { CreateMuebleUseCase } from "../../application/use-cases/mueble/create-mueble.use-case";
import { ListMueblesUseCase } from "../../application/use-cases/mueble/list-mueble.use-case";
import { FindMuebleByIdUseCase } from "../../application/use-cases/mueble/find-mueble-by-id.use-case";
import { UpdateMuebleUseCase } from "../../application/use-cases/mueble/update-mueble.use-case";
import { DeleteMuebleUseCase } from "../../application/use-cases/mueble/delete-mueble.use-case";

import { CreateHabitacionUseCase } from "../../application/use-cases/habitacion/create-habitacion.use-case";
import { ListHabitacionUseCase } from "../../application/use-cases/habitacion/list-habitacion.use-case";
import { FindHabitacionByIdUseCase } from "../../application/use-cases/habitacion/find-habitacion-by-id.use-case";
import { UpdateHabitacionUseCase } from "../../application/use-cases/habitacion/update-habitacion.use-case";
import { UpdateHabitacionStatusUseCase } from "../../application/use-cases/habitacion/update-habitacion-status.use-case";
import { DeleteHabitacionUseCase } from "../../application/use-cases/habitacion/delete-habitacion.use-case";
import { SearchAvailableHabitacionesUseCase } from "../../application/use-cases/habitacion/search-available-habitaciones.use-case";
import { FindHabitacionByIdWithPriceUseCase } from "../../application/use-cases/habitacion/find-habitacion-by-id-with-price.use-case";

import { CreateTipoHabitacionUseCase } from "../../application/use-cases/tipo-habitacion/create-tipo-habitacion.use-case";
import { ListTipoHabitacionUseCase } from "../../application/use-cases/tipo-habitacion/list-tipo-habitacion.use-case";
import { FindTipoHabitacionByIdUseCase } from "../../application/use-cases/tipo-habitacion/find-tipo-habitacion-by-id.use-case";
import { UpdateTipoHabitacionUseCase } from "../../application/use-cases/tipo-habitacion/update-tipo-habitacion.use-case";
import { DeleteTipoHabitacionUseCase } from "../../application/use-cases/tipo-habitacion/delete-tipo-habitacion.use-case";

import { CreateReservaUseCase } from "../../application/use-cases/reserva/create-reserva.use-case";
import { ListReservaPaginatedUseCase } from "../../application/use-cases/reserva/list-reserva-paginated.use-case";
import { ListReservaUseCase } from "../../application/use-cases/reserva/list-reserva.use-case";
import { FindReservaByIdUseCase } from "../../application/use-cases/reserva/find-reserva-by-id.use-case";
import { UpdateReservaUseCase } from "../../application/use-cases/reserva/update-reserva.use-case";
import { DeleteReservaUseCase } from "../../application/use-cases/reserva/delete-reserva.use-case";
import { CancelReservaUseCase } from "../../application/use-cases/reserva/cancel-reserva.use-case";
import { UpdateEstadoReservaUseCase } from "../../application/use-cases/reserva/update-estado-reserva.use-case";

import { CreatePagoUseCase } from "../../application/use-cases/pago/create-pago.use-case";
import { ListPagoUseCase } from "../../application/use-cases/pago/list-pago.use-case";
import { FindPagoByIdUseCase } from "../../application/use-cases/pago/find-pago-by-id.use-case";
import { UpdatePagoUseCase } from "../../application/use-cases/pago/update-pago.use-case";
import { DeletePagoUseCase } from "../../application/use-cases/pago/delete-pago.use-case";

import { CreateHuespedUseCase } from "../../application/use-cases/huesped/create-huesped.use-case";
import { ListHuespedPaginatedUseCase } from "../../application/use-cases/huesped/list-huesped-paginated.use-case";
import { FindHuespedByIdUseCase } from "../../application/use-cases/huesped/find-huesped-by-id.use-case";
import { UpdateHuespedUseCase } from "../../application/use-cases/huesped/update-huesped.use-case";
import { DeleteHuespedUseCase } from "../../application/use-cases/huesped/delete-huesped.use-case";

import { CreateCanalUseCase } from "../../application/use-cases/canal/create-canal.use-case";
import { ListCanalUseCase } from "../../application/use-cases/canal/list-canal.use-case";
import { FindCanalByIdUseCase } from "../../application/use-cases/canal/find-canal-by-id.use-case";
import { UpdateCanalUseCase } from "../../application/use-cases/canal/update-canal.use-case";
import { DeleteCanalUseCase } from "../../application/use-cases/canal/delete-canal.use-case";

import { CreateTarifaUseCase } from "../../application/use-cases/tarifa/create-tarifa.use-case";
import { ListTarifaUseCase } from "../../application/use-cases/tarifa/list-tarifa.use-case";
import { FindTarifaByIdUseCase } from "../../application/use-cases/tarifa/find-tarifa-by-id.use-case";
import { UpdateTarifaUseCase } from "../../application/use-cases/tarifa/update-tarifa.use-case";
import { DeleteTarifaUseCase } from "../../application/use-cases/tarifa/delete-tarifa.use-case";

import { CreateEstanciaUseCase } from "../../application/use-cases/estancia/create-estancia.use-case";
import { ListEstanciaUseCase } from "../../application/use-cases/estancia/list-estancia.use-case";
import { FindEstanciaByIdUseCase } from "../../application/use-cases/estancia/find-estancia-by-id.use-case";
import { UpdateEstanciaUseCase } from "../../application/use-cases/estancia/update-estancia.use-case";
import { DeleteEstanciaUseCase } from "../../application/use-cases/estancia/delete-estancia.use-case";
import { CheckoutEstanciaUseCase } from "../../application/use-cases/estancia/checkout-estancia.use-case";

import { CreateCategoriaMuebleUseCase } from "../../application/use-cases/categoria-mueble/create-categoria-mueble.use-case";
import { ListCategoriaMuebleUseCase } from "../../application/use-cases/categoria-mueble/list-categoria-mueble.use-case";
import { FindCategoriaMuebleUseCase } from "../../application/use-cases/categoria-mueble/find-categoria-mueble-by-id.use-case";
import { UpdateCategoriaMuebleUseCase } from "../../application/use-cases/categoria-mueble/update-categoria-mueble.use-case";
import { DeleteCategoriaMuebleUseCase } from "../../application/use-cases/categoria-mueble/delete-categoria-mueble.use-case";

import { MuebleController } from "../../presentation/controllers/mueble.controller";
import { HabitacionController } from "../../presentation/controllers/habitacion.controller";
import { TipoHabitacionController } from "../../presentation/controllers/tipo-habitacion.controller";
import { ReservaController } from "../../presentation/controllers/reserva.controller";
import { PagoController } from "../../presentation/controllers/pago.controller";
import { HuespedController } from "../../presentation/controllers/huesped.controller";
import { CanalController } from "../../presentation/controllers/canal.controller";
import { TarifaController } from "../../presentation/controllers/tarifa.controller";
import { EstanciaController } from "../../presentation/controllers/estancia.controller";
import { CategoriaMuebleController } from "../../presentation/controllers/categoria-mueble.controller";

const repositoryBindings: Array<[symbol, new (...args: never[]) => unknown]> = [
  [DI_TOKENS.IMuebleRepository, MuebleRepository],
  [DI_TOKENS.IHabitacionRepository, HabitacionRepository],
  [DI_TOKENS.ITipoHabitacionRepository, TipoHabitacionRepository],
  [DI_TOKENS.IReservaRepository, ReservaRepository],
  [DI_TOKENS.IHuespedRepository, HuespedRepository],
  [DI_TOKENS.ITarifaRepository, TarifaRepository],
  [DI_TOKENS.IPagoRepository, PagoRepository],
  [DI_TOKENS.IUserRepository, UserRepository],
  [DI_TOKENS.IEstanciaRepository, EstanciaRepository],
  [DI_TOKENS.ICanalRepository, CanalRepository],
  [DI_TOKENS.ICategoriaMuebleRepository, CategoriaMuebleRepository],
];

const useCaseAndControllerClasses: Array<new (...args: never[]) => unknown> = [
  CreateMuebleUseCase,
  ListMueblesUseCase,
  FindMuebleByIdUseCase,
  UpdateMuebleUseCase,
  DeleteMuebleUseCase,
  CreateHabitacionUseCase,
  ListHabitacionUseCase,
  FindHabitacionByIdUseCase,
  UpdateHabitacionUseCase,
  UpdateHabitacionStatusUseCase,
  DeleteHabitacionUseCase,
  SearchAvailableHabitacionesUseCase,
  FindHabitacionByIdWithPriceUseCase,
  CreateTipoHabitacionUseCase,
  ListTipoHabitacionUseCase,
  FindTipoHabitacionByIdUseCase,
  UpdateTipoHabitacionUseCase,
  DeleteTipoHabitacionUseCase,
  CreateReservaUseCase,
episodio@episodio:~/Escritorio/Hono/Hotel-backend$ git pull --rebase origin fix/reserva
Desde https://github.com/Jhon2xQ/Hotel-Backend
 * branch            fix/reserva -> FETCH_HEAD
warning: se ha saltado el commit cf217e6 aplicado previamente
ayuda: use --reapply-cherry-picks para incluir los commits saltados
ayuda: Disable this message with "git config advice.skippedCherryPicks false"
descartando $4f15abf5cd7111e422fc479328b0d8f18aec2c13 Fix/reserva (#25) -- contenidos del parche ya están en upstream
Rebase aplicado satisfactoriamente y actualizado refs/heads/fix/reserva.
episodio@episodio:~/Escritorio/Hono/Hotel-backend$   ListReservaPaginatedUseCase,
  ListReservaUseCase,
  FindReservaByIdUseCase,
  UpdateReservaUseCase,
  DeleteReservaUseCase,
  CancelReservaUseCase,
  UpdateEstadoReservaUseCase,
  CreatePagoUseCase,
  ListPagoUseCase,
  FindPagoByIdUseCase,
  UpdatePagoUseCase,
  DeletePagoUseCase,
  CreateHuespedUseCase,
  ListHuespedPaginatedUseCase,
  FindHuespedByIdUseCase,
  UpdateHuespedUseCase,
  DeleteHuespedUseCase,
  CreateCanalUseCase,
  ListCanalUseCase,
  FindCanalByIdUseCase,
  UpdateCanalUseCase,
  DeleteCanalUseCase,
  CreateTarifaUseCase,
  ListTarifaUseCase,
  FindTarifaByIdUseCase,
  UpdateTarifaUseCase,
  DeleteTarifaUseCase,
  CreateEstanciaUseCase,
  ListEstanciaUseCase,
  FindEstanciaByIdUseCase,
  UpdateEstanciaUseCase,
  DeleteEstanciaUseCase,
  CheckoutEstanciaUseCase,
  CreateCategoriaMuebleUseCase,
  ListCategoriaMuebleUseCase,
  FindCategoriaMuebleUseCase,
  UpdateCategoriaMuebleUseCase,
  DeleteCategoriaMuebleUseCase,
  MuebleController,
  HabitacionController,
  TipoHabitacionController,
  ReservaController,
  PagoController,
  HuespedController,
  CanalController,
  TarifaController,
  EstanciaController,
  CategoriaMuebleController,
];

/**
 * Registers Prisma, repositories, use-cases, and controllers on the root container.
 * Call once at startup. Tests should call {@link resetContainer} before each registration.
 */
export function registerDependencies(prisma: PrismaClient): void {
  container.registerInstance(DI_TOKENS.PrismaClient, prisma);

  for (const [token, ctor] of repositoryBindings) {
    container.registerSingleton(token, ctor);
  }

  for (const cls of useCaseAndControllerClasses) {
    container.registerSingleton(cls, cls);
  }
}

/** Limpia el contenedor (tests: llamar antes de {@link registerDependencies}). */
export function resetContainer(): void {
  container.reset();
}
