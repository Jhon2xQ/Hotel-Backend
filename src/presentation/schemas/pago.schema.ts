import { z } from "zod";

export const ConceptoPagoSchema = z.enum(["RESERVA", "CONSUMO"]);

export const EstadoPagoSchema = z.enum(["CONFIRMADO", "DEVUELTO", "RETENIDO", "ANULADO"]);

export const MetodoPagoSchema = z.enum(["EFECTIVO", "VISA", "MASTERCARD", "AMEX", "TRANSFERENCIA"]);

export const CreatePagoSchema = z.object({
  concepto: ConceptoPagoSchema,
  estado: EstadoPagoSchema.optional(),
  fecha_pago: z.coerce.date({ message: "La fecha de pago debe ser una fecha válida" }).optional(),
  monto: z.number().positive("El monto debe ser mayor a cero"),
  moneda: z.string().length(3, "La moneda debe ser un código de 3 caracteres").optional(),
  metodo: MetodoPagoSchema,
  recibido_por_id: z.string().optional(),
  observacion: z.string().optional(),
});

export const UpdatePagoSchema = z.object({
  concepto: ConceptoPagoSchema.optional(),
  estado: EstadoPagoSchema.optional(),
  fecha_pago: z.coerce.date({ message: "La fecha de pago debe ser una fecha válida" }).optional(),
  monto: z.number().positive("El monto debe ser mayor a cero").optional(),
  moneda: z.string().length(3, "La moneda debe ser un código de 3 caracteres").optional(),
  metodo: MetodoPagoSchema.optional(),
  observacion: z.string().optional(),
});
