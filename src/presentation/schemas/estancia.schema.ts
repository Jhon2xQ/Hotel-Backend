import { z } from "zod";

const EstadoEstadiaEnum = z.enum(["EN_CASA", "COMPLETADA", "SALIDA_ANTICIPADA"]);

export const CreateEstanciaSchema = z
  .object({
    reservaId: z.string().uuid("ID de reserva inválido"),
    habitacionId: z.string().uuid("ID de habitación inválido"),
    huespedId: z.string().uuid("ID de huésped inválido"),
    fechaEntrada: z.string().datetime("Fecha de entrada inválida").optional(),
    fechaSalida: z.string().datetime("Fecha de salida inválida").nullable().optional(),
    estado: EstadoEstadiaEnum.optional(),
    notas: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.fechaEntrada && data.fechaSalida) {
        return new Date(data.fechaSalida) > new Date(data.fechaEntrada);
      }
      return true;
    },
    {
      message: "La fecha de salida debe ser posterior a la fecha de entrada",
      path: ["fechaSalida"],
    },
  );

export const UpdateEstanciaSchema = z
  .object({
    reservaId: z.string().uuid("ID de reserva inválido").optional(),
    habitacionId: z.string().uuid("ID de habitación inválido").optional(),
    huespedId: z.string().uuid("ID de huésped inválido").optional(),
    fechaEntrada: z.string().datetime("Fecha de entrada inválida").optional(),
    fechaSalida: z.string().datetime("Fecha de salida inválida").nullable().optional(),
    estado: EstadoEstadiaEnum.optional(),
    notas: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.fechaEntrada && data.fechaSalida) {
        return new Date(data.fechaSalida) > new Date(data.fechaEntrada);
      }
      return true;
    },
    {
      message: "La fecha de salida debe ser posterior a la fecha de entrada",
      path: ["fechaSalida"],
    },
  );

export const CheckoutEstanciaSchema = z.object({
  fechaSalida: z.string().datetime("Fecha de salida inválida"),
});
