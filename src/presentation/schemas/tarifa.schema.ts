import { z } from "zod";

export const CreateTarifaSchema = z.object({
  tipo_habitacion_id: z.string().uuid("El ID del tipo de habitación debe ser un UUID válido"),
  canal_id: z.string().uuid("El ID del canal debe ser un UUID válido"),
  precio: z.number().positive("El precio debe ser mayor a 0"),
  unidad: z.string().max(4, "La unidad debe tener máximo 4 caracteres").optional(),
  iva: z.number().min(0).max(100).optional(),
  cargo_servicios: z.number().min(0).max(100).optional(),
  moneda: z.string().length(3, "La moneda debe tener 3 caracteres").optional(),
});

export const UpdateTarifaSchema = z.object({
  tipo_habitacion_id: z.string().uuid("El ID del tipo de habitación debe ser un UUID válido").optional(),
  canal_id: z.string().uuid("El ID del canal debe ser un UUID válido").optional(),
  precio: z.number().positive("El precio debe ser mayor a 0").optional(),
  unidad: z.string().max(4, "La unidad debe tener máximo 4 caracteres").optional(),
  iva: z.number().min(0).max(100).optional(),
  cargo_servicios: z.number().min(0).max(100).optional(),
  moneda: z.string().length(3, "La moneda debe tener 3 caracteres").optional(),
});

export const UUIDParamSchema = z.object({
  id: z.uuid("El ID debe ser un UUID válido"),
});
