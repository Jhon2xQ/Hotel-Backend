import { z } from "zod";

export const UnidadInsumoCocinaSchema = z.enum([
  "UNIDAD",
  "LITRO",
  "KG",
  "GR",
  "BOTELLA",
  "CAJA",
  "FCO",
  "SACO",
  "TUBO",
  "BLISTER",
  "PAQUETE",
]);

export const TipoMovimientoSchema = z.enum(["ENTRADA", "SALIDA"]);

export const MotivoEntradaSchema = z.enum(["COMPRA", "DONACION", "AJUSTE", "REPOSICION"]);

export const MotivoSalidaSchema = z.enum(["CONSUMO", "DESECHO", "AJUSTE", "STOCK_MINIMO"]);

export const CreateInsumoCocinaSchema = z.object({
  codigo: z.string().min(1, "El código es requerido").max(30, "El código no puede exceder 30 caracteres"),
  nombre: z.string().min(1, "El nombre es requerido").max(150, "El nombre no puede exceder 150 caracteres"),
  unidad: UnidadInsumoCocinaSchema,
  stock_actual: z
    .number()
    .min(0, "El stock actual debe ser mayor o igual a 0")
    .max(999999.999, "El stock no puede exceder 999999.999")
    .optional(),
  stock_minimo: z
    .number()
    .min(0, "El stock mínimo debe ser mayor o igual a 0")
    .max(999999.999, "El stock mínimo no puede exceder 999999.999")
    .optional(),
  notas: z.string().optional(),
});

export const UpdateInsumoCocinaSchema = z.object({
  codigo: z.string().min(1, "El código es requerido").max(30, "El código no puede exceder 30 caracteres").optional(),
  nombre: z.string().min(1, "El nombre es requerido").max(150, "El nombre no puede exceder 150 caracteres").optional(),
  unidad: UnidadInsumoCocinaSchema.optional(),
  stock_actual: z
    .number()
    .min(0, "El stock actual debe ser mayor o igual a 0")
    .max(999999.999, "El stock no puede exceder 999999.999")
    .optional(),
  stock_minimo: z
    .number()
    .min(0, "El stock mínimo debe ser mayor o igual a 0")
    .max(999999.999, "El stock mínimo no puede exceder 999999.999")
    .optional(),
  notas: z.string().optional(),
  activo: z.boolean().optional(),
});

export const CreateMovimientoCocinaSchema = z
  .object({
    insumo_id: z.uuid("El ID del insumo debe ser un UUID válido"),
    tipo: TipoMovimientoSchema,
    cantidad: z
      .number()
      .min(0.001, "La cantidad debe ser mayor a 0")
      .max(999999.999, "La cantidad no puede exceder 999999.999"),
    motivo_entrada: MotivoEntradaSchema.optional(),
    motivo_salida: MotivoSalidaSchema.optional(),
    notas: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.tipo === "ENTRADA" && !data.motivo_entrada) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El motivo de entrada es requerido cuando el tipo es ENTRADA",
        path: ["motivo_entrada"],
      });
    }
    if (data.tipo === "SALIDA" && !data.motivo_salida) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El motivo de salida es requerido cuando el tipo es SALIDA",
        path: ["motivo_salida"],
      });
    }
  });

export const MovimientoCocinaFiltersSchema = z.object({
  insumo_id: z.uuid().optional(),
  tipo: TipoMovimientoSchema.optional(),
  fecha_inicio: z.coerce.date().optional(),
  fecha_fin: z.coerce.date().optional(),
});

export const UUIDParamSchema = z.object({
  id: z.uuid("El ID debe ser un UUID válido"),
});

export type CreateInsumoCocinaInput = z.infer<typeof CreateInsumoCocinaSchema>;
export type UpdateInsumoCocinaInput = z.infer<typeof UpdateInsumoCocinaSchema>;
export type CreateMovimientoCocinaInput = z.infer<typeof CreateMovimientoCocinaSchema>;
export type MovimientoCocinaFiltersInput = z.infer<typeof MovimientoCocinaFiltersSchema>;