import { Pago, ConceptoPago, EstadoPago, MetodoPago, PersonalBasic } from "../../src/domain/entities/pago.entity";

export function createMockPago(overrides?: Partial<Pago>): Pago {
  const mockPersonal: PersonalBasic = {
    id: "personal-123",
    codigo: "P001",
    nombres: "Juan",
    apellidos: "Pérez",
  };

  return new Pago(
    overrides?.id ?? "test-pago-id",
    overrides?.concepto ?? ConceptoPago.RESERVA,
    overrides?.estado ?? EstadoPago.CONFIRMADO,
    overrides?.fechaPago ?? new Date("2026-03-18T14:30:00.000Z"),
    overrides?.monto ?? 150.0,
    overrides?.moneda ?? "USD",
    overrides?.metodo ?? MetodoPago.EFECTIVO,
    overrides?.recibidoPorId ?? "personal-123",
    overrides?.recibidoPor ?? mockPersonal,
    overrides?.notas ?? "Pago de prueba",
    overrides?.createdAt ?? new Date(),
  );
}

export function createMockPersonal(overrides?: Partial<PersonalBasic>): PersonalBasic {
  return {
    id: overrides?.id ?? "personal-123",
    codigo: overrides?.codigo ?? "P001",
    nombres: overrides?.nombres ?? "Juan",
    apellidos: overrides?.apellidos ?? "Pérez",
  };
}
