import { Pago, ConceptoPago, EstadoPago, MetodoPago } from "../../src/domain/entities/pago.entity";

type RecibidoPor = { id: string; name: string; email: string };

export function createMockPago(overrides?: Partial<Pago>): Pago {
  const mockUser: RecibidoPor = {
    id: "user-123",
    name: "Juan Pérez",
    email: "juan.perez@hotel.com",
  };

  return new Pago(
    overrides?.id ?? "test-pago-id",
    overrides?.concepto ?? ConceptoPago.RESERVA,
    overrides?.estado ?? EstadoPago.CONFIRMADO,
    overrides?.fechaPago ?? new Date("2026-03-18T14:30:00.000Z"),
    overrides?.monto ?? 150.0,
    overrides?.moneda ?? "SOL",
    overrides?.metodo ?? MetodoPago.EFECTIVO,
    overrides?.recibidoPorId ?? "user-123",
    overrides?.recibidoPor ?? mockUser,
    overrides?.observacion ?? "Pago de prueba",
    overrides?.createdAt ?? new Date(),
  );
}

export function createMockUser(overrides?: Partial<RecibidoPor>): RecibidoPor {
  return {
    id: overrides?.id ?? "user-123",
    name: overrides?.name ?? "Juan Pérez",
    email: overrides?.email ?? "juan.perez@hotel.com",
  };
}
