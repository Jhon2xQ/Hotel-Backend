import { z } from "zod";
import { PaginationQuerySchema } from "./pagination.schema";

const EstadoReservaEnum = z.enum(["TENTATIVA", "CONFIRMADA", "EN_CASA", "COMPLETADA", "CANCELADA", "NO_LLEGO"]);

function parseDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export const CreateReservaSchema = z
  .object({
    huespedId: z.uuid("ID de huésped inválido"),
    habitacionId: z.uuid("ID de habitación inválido"),
    tarifaId: z.uuid("ID de tarifa inválido"),
    fechaEntrada: z.string().date("Fecha de entrada inválida"),
    fechaSalida: z.string().date("Fecha de salida inválida"),
    adultos: z.number().int().min(1, "Debe haber al menos 1 adulto"),
    ninos: z.number().int().min(0, "El número de niños no puede ser negativo").default(0),
  })
  .refine((data) => data.fechaSalida > data.fechaEntrada, {
    message: "La fecha de salida debe ser posterior a la fecha de entrada",
    path: ["fechaSalida"],
  })
  .transform((data) => ({
    ...data,
    fechaEntrada: parseDate(data.fechaEntrada),
    fechaSalida: parseDate(data.fechaSalida),
  }));

export const UpdateReservaSchema = z
  .object({
    huespedId: z.uuid("ID de huésped inválido").optional(),
    habitacionId: z.uuid("ID de habitación inválido").optional(),
    tarifaId: z.uuid("ID de tarifa inválido").optional(),
    pagoId: z.uuid("ID de pago inválido").nullable().optional(),
    fechaEntrada: z.string().date("Fecha de entrada inválida").optional(),
    fechaSalida: z.string().date("Fecha de salida inválida").optional(),
    adultos: z.number().int().min(1, "Debe haber al menos 1 adulto").optional(),
    ninos: z.number().int().min(0, "El número de niños no puede ser negativo").optional(),
    estado: EstadoReservaEnum.optional(),
  })
  .refine(
    (data) => {
      if (data.fechaEntrada && data.fechaSalida) {
        return data.fechaSalida > data.fechaEntrada;
      }
      return true;
    },
    {
      message: "La fecha de salida debe ser posterior a la fecha de entrada",
      path: ["fechaSalida"],
    },
  )
  .transform((data) => ({
    ...data,
    fechaEntrada: data.fechaEntrada ? parseDate(data.fechaEntrada) : undefined,
    fechaSalida: data.fechaSalida ? parseDate(data.fechaSalida) : undefined,
  }));

export const CancelReservaSchema = z.object({
  motivoCancel: z.string().min(1, "El motivo de cancelación es requerido"),
});

export const UpdateEstadoReservaSchema = z.object({
  estado: z.enum(["TENTATIVA", "CONFIRMADA", "EN_CASA", "COMPLETADA", "CANCELADA", "NO_LLEGO"], {
    message: "Estado inválido",
  }),
});

export const ReservaQuerySchema = PaginationQuerySchema.extend({
  name: z.string().optional(),
  tipo: z.string().optional(),
});

export type ReservaQuery = z.infer<typeof ReservaQuerySchema>;
