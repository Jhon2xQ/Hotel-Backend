import { z } from "zod";
import { EstadoEstadia } from "../../domain/entities/estancia.entity";

const EstadoEstadiaEnum = z.nativeEnum(EstadoEstadia);

const CreateEstanciaSchemaRaw = z
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

export const CreateEstanciaSchema = CreateEstanciaSchemaRaw.transform((data) => ({
  reservaId: data.reservaId,
  habitacionId: data.habitacionId,
  huespedId: data.huespedId,
  fechaEntrada: data.fechaEntrada ? new Date(data.fechaEntrada) : undefined,
  fechaSalida:
    data.fechaSalida === undefined
      ? undefined
      : data.fechaSalida === null
        ? null
        : new Date(data.fechaSalida),
  estado: data.estado,
  notas: data.notas,
}));

const UpdateEstanciaSchemaRaw = z
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

export const UpdateEstanciaSchema = UpdateEstanciaSchemaRaw.transform((data) => ({
  reservaId: data.reservaId,
  habitacionId: data.habitacionId,
  huespedId: data.huespedId,
  fechaEntrada: data.fechaEntrada === undefined ? undefined : new Date(data.fechaEntrada),
  fechaSalida:
    data.fechaSalida === undefined
      ? undefined
      : data.fechaSalida === null
        ? null
        : new Date(data.fechaSalida),
  estado: data.estado,
  notas: data.notas,
}));

const CheckoutEstanciaSchemaRaw = z.object({
  fechaSalida: z.string().datetime("Fecha de salida inválida"),
});

export const CheckoutEstanciaSchema = CheckoutEstanciaSchemaRaw.transform((data) => ({
  fechaSalida: new Date(data.fechaSalida),
}));
