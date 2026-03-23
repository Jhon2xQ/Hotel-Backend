import { z } from "zod";

const EstadoReservaEnum = z.enum(["TENTATIVA", "CONFIRMADA", "EN_CASA", "COMPLETADA", "CANCELADA", "NO_LLEGO"]);

export const CreateReservaSchema = z
  .object({
    codigo: z.string().min(1, "El código es requerido"),
    huespedId: z.string().uuid("ID de huésped inválido"),
    habitacionId: z.string().uuid("ID de habitación inválido"),
    tarifaId: z.string().uuid("ID de tarifa inválido"),
    fechaEntrada: z.string().datetime("Fecha de entrada inválida"),
    fechaSalida: z.string().datetime("Fecha de salida inválida"),
    adultos: z.number().int().min(1, "Debe haber al menos 1 adulto"),
    ninos: z.number().int().min(0, "El número de niños no puede ser negativo").default(0),
    montoDescuento: z.number().min(0, "El descuento no puede ser negativo").optional().default(0),
  })
  .refine((data) => new Date(data.fechaSalida) > new Date(data.fechaEntrada), {
    message: "La fecha de salida debe ser posterior a la fecha de entrada",
    path: ["fechaSalida"],
  });

export const UpdateReservaSchema = z
  .object({
    huespedId: z.string().uuid("ID de huésped inválido").optional(),
    habitacionId: z.string().uuid("ID de habitación inválido").optional(),
    tarifaId: z.string().uuid("ID de tarifa inválido").optional(),
    pagoId: z.string().uuid("ID de pago inválido").nullable().optional(),
    fechaEntrada: z.string().datetime("Fecha de entrada inválida").optional(),
    fechaSalida: z.string().datetime("Fecha de salida inválida").optional(),
    adultos: z.number().int().min(1, "Debe haber al menos 1 adulto").optional(),
    ninos: z.number().int().min(0, "El número de niños no puede ser negativo").optional(),
    montoDescuento: z.number().min(0, "El descuento no puede ser negativo").optional(),
    estado: EstadoReservaEnum.optional(),
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

export const CancelReservaSchema = z.object({
  motivoCancel: z.string().min(1, "El motivo de cancelación es requerido"),
});
