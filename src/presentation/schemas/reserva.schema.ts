import { z } from "zod";
import { PaginationQuerySchema } from "./pagination.schema";

const EstadoReservaEnum = z.enum(["TENTATIVA", "CONFIRMADA", "EN_CASA", "COMPLETADA", "CANCELADA", "NO_LLEGO"]);

function parseDateTime(s: string): Date {
  return new Date(s);
}

export const CreateReservaSchema = z
  .object({
    huespedId: z.uuid("ID de huésped inválido"),
    habitacionId: z.uuid("ID de habitación inválido"),
    tarifaId: z.uuid("ID de tarifa inválido"),
    fechaInicio: z.string().datetime("Fecha de inicio inválida").or(z.string().date("Fecha de inicio inválida")),
    fechaFin: z.string().datetime("Fecha de fin inválida").or(z.string().date("Fecha de fin inválida")),
    adultos: z.number().int().min(1, "Debe haber al menos 1 adulto"),
    ninos: z.number().int().min(0, "El número de niños no puede ser negativo").default(0),
    promociones: z.array(z.uuid("ID de promoción inválido")).optional(),
  })
  .refine((data) => new Date(data.fechaFin) > new Date(data.fechaInicio), {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["fechaFin"],
  })
  .transform((data) => ({
    ...data,
    fechaInicio: parseDateTime(data.fechaInicio),
    fechaFin: parseDateTime(data.fechaFin),
  }));

export const UpdateReservaSchema = z
  .object({
    huespedId: z.uuid("ID de huésped inválido").optional(),
    habitacionId: z.uuid("ID de habitación inválido").optional(),
    tarifaId: z.uuid("ID de tarifa inválido").optional(),
    pagoId: z.uuid("ID de pago inválido").nullable().optional(),
    fechaInicio: z.string().datetime("Fecha de inicio inválida").or(z.string().date("Fecha de inicio inválida")).optional(),
    fechaFin: z.string().datetime("Fecha de fin inválida").or(z.string().date("Fecha de fin inválida")).optional(),
    adultos: z.number().int().min(1, "Debe haber al menos 1 adulto").optional(),
    ninos: z.number().int().min(0, "El número de niños no puede ser negativo").optional(),
    estado: EstadoReservaEnum.optional(),
  })
  .refine(
    (data) => {
      if (data.fechaInicio && data.fechaFin) {
        return new Date(data.fechaFin) > new Date(data.fechaInicio);
      }
      return true;
    },
    {
      message: "La fecha de fin debe ser posterior a la fecha de inicio",
      path: ["fechaFin"],
    },
  )
  .transform((data) => ({
    ...data,
    fechaInicio: data.fechaInicio ? parseDateTime(data.fechaInicio) : undefined,
    fechaFin: data.fechaFin ? parseDateTime(data.fechaFin) : undefined,
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
  nombre: z.string().optional(),
  tipo: z.string().optional(),
});

export type ReservaQuery = z.infer<typeof ReservaQuerySchema>;
