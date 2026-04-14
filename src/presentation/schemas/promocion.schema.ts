import { z } from "zod";

function parseDateTime(s: string): Date {
  return new Date(s);
}

export const UUIDParamSchema = z.object({
  id: z.uuid("El ID debe ser un UUID válido"),
});

export const CreatePromocionSchema = z
  .object({
    codigo: z.string().min(1, "El código es requerido"),
    tipo_descuento: z.enum(["PORCENTAJE", "MONTO_FIJO"], {
      message: "El tipo de descuento debe ser PORCENTAJE o MONTO_FIJO",
    }),
    valor_descuento: z.number().positive("El valor de descuento debe ser mayor a cero"),
    vig_desde: z.string().datetime("Fecha de inicio inválida").or(z.string().date("Fecha de inicio inválida")),
    vig_hasta: z.string().datetime("Fecha de fin inválida").or(z.string().date("Fecha de fin inválida")),
    estado: z.boolean().optional(),
    habitacion_ids: z.array(z.uuid("ID de habitación inválido")).optional(),
  })
  .refine((data) => new Date(data.vig_hasta) > new Date(data.vig_desde), {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["vig_hasta"],
  })
  .transform((data) => ({
    ...data,
    vig_desde: parseDateTime(data.vig_desde),
    vig_hasta: parseDateTime(data.vig_hasta),
  }));

export const UpdatePromocionSchema = z
  .object({
    codigo: z.string().min(1, "El código es requerido").optional(),
    tipo_descuento: z.enum(["PORCENTAJE", "MONTO_FIJO"], {
      message: "El tipo de descuento debe ser PORCENTAJE o MONTO_FIJO",
    }).optional(),
    valor_descuento: z.number().positive("El valor de descuento debe ser mayor a cero").optional(),
    vig_desde: z.string().datetime("Fecha de inicio inválida").or(z.string().date("Fecha de inicio inválida")).optional(),
    vig_hasta: z.string().datetime("Fecha de fin inválida").or(z.string().date("Fecha de fin inválida")).optional(),
    estado: z.boolean().optional(),
    habitacion_ids: z.array(z.uuid("ID de habitación inválido")).optional(),
  })
  .refine(
    (data) => {
      if (data.vig_desde && data.vig_hasta) {
        return new Date(data.vig_hasta) > new Date(data.vig_desde);
      }
      return true;
    },
    {
      message: "La fecha de fin debe ser posterior a la fecha de inicio",
      path: ["vig_hasta"],
    },
  )
  .transform((data) => ({
    ...data,
    vig_desde: data.vig_desde ? parseDateTime(data.vig_desde) : undefined,
    vig_hasta: data.vig_hasta ? parseDateTime(data.vig_hasta) : undefined,
  }));
