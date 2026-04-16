/**
 * Injection tokens for interfaces (TypeScript erases interfaces at runtime).
 */
export const DI_TOKENS = {
  PrismaClient: Symbol.for("PrismaClient"),
  IMuebleRepository: Symbol.for("IMuebleRepository"),
  IHabitacionRepository: Symbol.for("IHabitacionRepository"),
  ITipoHabitacionRepository: Symbol.for("ITipoHabitacionRepository"),
  IReservaRepository: Symbol.for("IReservaRepository"),
  IHuespedRepository: Symbol.for("IHuespedRepository"),
  ITarifaRepository: Symbol.for("ITarifaRepository"),
  IPagoRepository: Symbol.for("IPagoRepository"),
  IUserRepository: Symbol.for("IUserRepository"),
  IEstanciaRepository: Symbol.for("IEstanciaRepository"),
  ICanalRepository: Symbol.for("ICanalRepository"),
  ICategoriaMuebleRepository: Symbol.for("ICategoriaMuebleRepository"),
  IPromocionRepository: Symbol.for("IPromocionRepository"),
  IProductoRepository: Symbol.for("IProductoRepository"),
} as const;
