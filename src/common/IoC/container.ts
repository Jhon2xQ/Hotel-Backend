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
import { CanalRepository } from "../../infrastructure/repositories/canal.repository";
import { CategoriaMuebleRepository } from "../../infrastructure/repositories/categoria-mueble.repository";
import { PromocionRepository } from "../../infrastructure/repositories/promocion.repository";
import { ProductoRepository } from "../../infrastructure/repositories/producto.repository";
import { FolioRepository } from "../../infrastructure/repositories/folio.repository";
import { InsumoBarRepository } from "../../infrastructure/repositories/insumo-bar.repository";
import { InsumoCocinaRepository } from "../../infrastructure/repositories/insumo-cocina.repository";
import { InternacionalizacionRepository } from "../../infrastructure/repositories/internacionalizacion.repository";

import { CreateMuebleUseCase } from "../../application/use-cases/mueble/create-mueble.use-case";
import { ListMueblesUseCase } from "../../application/use-cases/mueble/list-mueble.use-case";
import { ListMueblePaginatedUseCase } from "../../application/use-cases/mueble/list-mueble-paginated.use-case";
import { FindMuebleByIdUseCase } from "../../application/use-cases/mueble/find-mueble-by-id.use-case";
import { UpdateMuebleUseCase } from "../../application/use-cases/mueble/update-mueble.use-case";
import { DeleteMuebleUseCase } from "../../application/use-cases/mueble/delete-mueble.use-case";

import { CreateHabitacionUseCase } from "../../application/use-cases/habitacion/create-habitacion.use-case";
import { ListHabitacionUseCase } from "../../application/use-cases/habitacion/list-habitacion.use-case";
import { ListHabitacionPaginatedUseCase } from "../../application/use-cases/habitacion/list-habitacion-paginated.use-case";
import { FindHabitacionByIdUseCase } from "../../application/use-cases/habitacion/find-habitacion-by-id.use-case";
import { FindHabitacionConFechasReservaUseCase } from "../../application/use-cases/habitacion/find-habitacion-con-fechas-reserva.use-case";
import { UpdateHabitacionUseCase } from "../../application/use-cases/habitacion/update-habitacion.use-case";
import { UpdateHabitacionStatusUseCase } from "../../application/use-cases/habitacion/update-habitacion-status.use-case";
import { DeleteHabitacionUseCase } from "../../application/use-cases/habitacion/delete-habitacion.use-case";
import { SearchAvailableHabitacionesUseCase } from "../../application/use-cases/habitacion/search-available-habitaciones.use-case";
import { FindHabitacionByIdWithPriceUseCase } from "../../application/use-cases/habitacion/find-habitacion-by-id-with-price.use-case";

import { CreateTipoHabitacionUseCase } from "../../application/use-cases/tipo-habitacion/create-tipo-habitacion.use-case";
import { ListTipoHabitacionUseCase } from "../../application/use-cases/tipo-habitacion/list-tipo-habitacion.use-case";
import { ListPublicTipoHabitacionUseCase } from "../../application/use-cases/tipo-habitacion/list-public-tipo-habitacion.use-case";
import { FindTipoHabitacionByIdUseCase } from "../../application/use-cases/tipo-habitacion/find-tipo-habitacion-by-id.use-case";
import { UpdateTipoHabitacionUseCase } from "../../application/use-cases/tipo-habitacion/update-tipo-habitacion.use-case";
import { DeleteTipoHabitacionUseCase } from "../../application/use-cases/tipo-habitacion/delete-tipo-habitacion.use-case";

import { CreateReservaUseCase } from "../../application/use-cases/reserva/create-reserva.use-case";
import { ListReservaPaginatedUseCase } from "../../application/use-cases/reserva/list-reserva-paginated.use-case";
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

import { CreateCategoriaMuebleUseCase } from "../../application/use-cases/categoria-mueble/create-categoria-mueble.use-case";
import { ListCategoriaMuebleUseCase } from "../../application/use-cases/categoria-mueble/list-categoria-mueble.use-case";
import { FindCategoriaMuebleUseCase } from "../../application/use-cases/categoria-mueble/find-categoria-mueble-by-id.use-case";
import { UpdateCategoriaMuebleUseCase } from "../../application/use-cases/categoria-mueble/update-categoria-mueble.use-case";
import { DeleteCategoriaMuebleUseCase } from "../../application/use-cases/categoria-mueble/delete-categoria-mueble.use-case";

import { CreatePromocionUseCase } from "../../application/use-cases/promocion/create-promocion.use-case";
import { ListPromocionUseCase } from "../../application/use-cases/promocion/list-promocion.use-case";
import { FindPromocionByIdUseCase } from "../../application/use-cases/promocion/find-promocion-by-id.use-case";
import { UpdatePromocionUseCase } from "../../application/use-cases/promocion/update-promocion.use-case";
import { DeletePromocionUseCase } from "../../application/use-cases/promocion/delete-promocion.use-case";

import { CreateProductoUseCase } from "../../application/use-cases/producto/create-producto.use-case";
import { ListProductoPaginatedUseCase } from "../../application/use-cases/producto/list-producto-paginated.use-case";
import { FindProductoByIdUseCase } from "../../application/use-cases/producto/find-producto-by-id.use-case";
import { UpdateProductoUseCase } from "../../application/use-cases/producto/update-producto.use-case";
import { DeleteProductoUseCase } from "../../application/use-cases/producto/delete-producto.use-case";

import { CreateFolioUseCase } from "../../application/use-cases/folio/create-folio.use-case";
import { ListFolioPaginatedUseCase } from "../../application/use-cases/folio/list-folio-paginated.use-case";
import { FindFolioByIdUseCase } from "../../application/use-cases/folio/find-folio-by-id.use-case";
import { UpdateFolioUseCase } from "../../application/use-cases/folio/update-folio.use-case";
import { DeleteFolioUseCase } from "../../application/use-cases/folio/delete-folio.use-case";
import { AddProductoFolioUseCase } from "../../application/use-cases/folio/add-producto-folio.use-case";
import { AddServicioFolioUseCase } from "../../application/use-cases/folio/add-servicio-folio.use-case";
import { GetConsumosFolioUseCase } from "../../application/use-cases/folio/get-consumos-folio.use-case";

import { CreateInsumoBarUseCase } from "../../application/use-cases/insumo-bar/create-insumo-bar.use-case";
import { ListInsumoBarUseCase } from "../../application/use-cases/insumo-bar/list-insumo-bar.use-case";
import { FindInsumoBarByIdUseCase } from "../../application/use-cases/insumo-bar/find-insumo-bar-by-id.use-case";
import { UpdateInsumoBarUseCase } from "../../application/use-cases/insumo-bar/update-insumo-bar.use-case";
import { DeleteInsumoBarUseCase } from "../../application/use-cases/insumo-bar/delete-insumo-bar.use-case";
import { RegisterMovimientoBarUseCase } from "../../application/use-cases/insumo-bar/register-movimiento-bar.use-case";
import { ListMovimientosBarUseCase } from "../../application/use-cases/insumo-bar/list-movimientos-bar.use-case";

import { CreateInsumoCocinaUseCase } from "../../application/use-cases/insumo-cocina/create-insumo-cocina.use-case";
import { ListInsumoCocinaUseCase } from "../../application/use-cases/insumo-cocina/list-insumo-cocina.use-case";
import { FindInsumoCocinaByIdUseCase } from "../../application/use-cases/insumo-cocina/find-insumo-cocina-by-id.use-case";
import { UpdateInsumoCocinaUseCase } from "../../application/use-cases/insumo-cocina/update-insumo-cocina.use-case";
import { DeleteInsumoCocinaUseCase } from "../../application/use-cases/insumo-cocina/delete-insumo-cocina.use-case";
import { RegisterMovimientoCocinaUseCase } from "../../application/use-cases/insumo-cocina/register-movimiento-cocina.use-case";
import { ListMovimientosCocinaUseCase } from "../../application/use-cases/insumo-cocina/list-movimientos-cocina.use-case";

import { MuebleController } from "../../presentation/controllers/mueble.controller";
import { HabitacionController } from "../../presentation/controllers/habitacion.controller";
import { TipoHabitacionController } from "../../presentation/controllers/tipo-habitacion.controller";
import { ReservaController } from "../../presentation/controllers/reserva.controller";
import { PagoController } from "../../presentation/controllers/pago.controller";
import { HuespedController } from "../../presentation/controllers/huesped.controller";
import { CanalController } from "../../presentation/controllers/canal.controller";
import { TarifaController } from "../../presentation/controllers/tarifa.controller";
import { CategoriaMuebleController } from "../../presentation/controllers/categoria-mueble.controller";
import { PromocionController } from "../../presentation/controllers/promocion.controller";
import { ProductoController } from "../../presentation/controllers/producto.controller";
import { FolioController } from "../../presentation/controllers/folio.controller";
import { InsumoBarController } from "../../presentation/controllers/insumo-bar.controller";
import { InsumoCocinaController } from "../../presentation/controllers/insumo-cocina.controller";
import { InternacionalizacionController } from "../../presentation/controllers/internacionalizacion.controller";
import { CreateInternacionalizacionUseCase } from "../../application/use-cases/internacionalizacion/create-internacionalizacion.use-case";
import { FindInternacionalizacionByHabitacionUseCase } from "../../application/use-cases/internacionalizacion/find-internacionalizacion-by-habitacion.use-case";
import { UpdateInternacionalizacionUseCase } from "../../application/use-cases/internacionalizacion/update-internacionalizacion.use-case";
import { DeleteInternacionalizacionUseCase } from "../../application/use-cases/internacionalizacion/delete-internacionalizacion.use-case";

const repositoryBindings: Array<[symbol, new (...args: never[]) => unknown]> = [
  [DI_TOKENS.IMuebleRepository, MuebleRepository],
  [DI_TOKENS.IHabitacionRepository, HabitacionRepository],
  [DI_TOKENS.ITipoHabitacionRepository, TipoHabitacionRepository],
  [DI_TOKENS.IReservaRepository, ReservaRepository],
  [DI_TOKENS.IHuespedRepository, HuespedRepository],
  [DI_TOKENS.ITarifaRepository, TarifaRepository],
  [DI_TOKENS.IPagoRepository, PagoRepository],
  [DI_TOKENS.IUserRepository, UserRepository],
  [DI_TOKENS.ICanalRepository, CanalRepository],
  [DI_TOKENS.ICategoriaMuebleRepository, CategoriaMuebleRepository],
  [DI_TOKENS.IPromocionRepository, PromocionRepository],
  [DI_TOKENS.IProductoRepository, ProductoRepository],
  [DI_TOKENS.IFolioRepository, FolioRepository],
  [DI_TOKENS.IInsumoBarRepository, InsumoBarRepository],
  [DI_TOKENS.IInsumoCocinaRepository, InsumoCocinaRepository],
  [DI_TOKENS.IInternacionalizacionRepository, InternacionalizacionRepository],
];

const useCaseAndControllerClasses: Array<new (...args: never[]) => unknown> = [
  CreateMuebleUseCase,
  ListMueblesUseCase,
  ListMueblePaginatedUseCase,
  FindMuebleByIdUseCase,
  UpdateMuebleUseCase,
  DeleteMuebleUseCase,
  CreateHabitacionUseCase,
  ListHabitacionUseCase,
  ListHabitacionPaginatedUseCase,
  FindHabitacionByIdUseCase,
  FindHabitacionConFechasReservaUseCase,
  UpdateHabitacionUseCase,
  UpdateHabitacionStatusUseCase,
  DeleteHabitacionUseCase,
  SearchAvailableHabitacionesUseCase,
  FindHabitacionByIdWithPriceUseCase,
  CreateTipoHabitacionUseCase,
  ListTipoHabitacionUseCase,
  ListPublicTipoHabitacionUseCase,
  FindTipoHabitacionByIdUseCase,
  UpdateTipoHabitacionUseCase,
  DeleteTipoHabitacionUseCase,
  CreateReservaUseCase,
  ListReservaPaginatedUseCase,
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
  CreateCategoriaMuebleUseCase,
  ListCategoriaMuebleUseCase,
  FindCategoriaMuebleUseCase,
  UpdateCategoriaMuebleUseCase,
  DeleteCategoriaMuebleUseCase,
  CreatePromocionUseCase,
  ListPromocionUseCase,
  FindPromocionByIdUseCase,
  UpdatePromocionUseCase,
  DeletePromocionUseCase,
  CreateProductoUseCase,
  ListProductoPaginatedUseCase,
  FindProductoByIdUseCase,
  UpdateProductoUseCase,
  DeleteProductoUseCase,
  MuebleController,
  HabitacionController,
  TipoHabitacionController,
  ReservaController,
  PagoController,
  HuespedController,
  CanalController,
  TarifaController,
  CategoriaMuebleController,
  PromocionController,
  ProductoController,
FolioController,
  CreateFolioUseCase,
  ListFolioPaginatedUseCase,
  FindFolioByIdUseCase,
  UpdateFolioUseCase,
  DeleteFolioUseCase,
  AddProductoFolioUseCase,
  AddServicioFolioUseCase,
  GetConsumosFolioUseCase,
  InsumoBarController,
  InsumoCocinaController,
  InternacionalizacionController,
  CreateInternacionalizacionUseCase,
  FindInternacionalizacionByHabitacionUseCase,
  UpdateInternacionalizacionUseCase,
  DeleteInternacionalizacionUseCase,
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
