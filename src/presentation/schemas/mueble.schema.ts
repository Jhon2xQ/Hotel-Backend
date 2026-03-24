import { z } from "zod";

export const MuebleCategorySchema = z.enum([
  "CAMA",
  "ASIENTO",
  "ALMACENAJE",
  "TECNOLOGIA",
  "BANO",
  "DECORACION",
  "OTRO",
]);

export const MuebleConditionSchema = z.enum(["BUENO", "REGULAR", "DANADO", "FALTANTE"]);

export const CreateMuebleSchema = z.object({
  codigo: z.string().min(1, "El código es requerido").max(30, "El código no puede exceder 30 caracteres"),
  nombre: z.string().min(1, "El nombre es requerido").max(100, "El nombre no puede exceder 100 caracteres"),
  categoria_id: z.string().uuid("La categoria debe ser un UUID valido"),
  imagen_url: z.string().url("Debe ser una URL válida").optional(),
  condicion: MuebleConditionSchema.optional(),
  fecha_adquisicion: z.string().date("Debe ser una fecha válida (YYYY-MM-DD)").optional(),
  ultima_revision: z.string().date("Debe ser una fecha válida (YYYY-MM-DD)").optional(),
  descripcion: z.string().optional(),
  habitacion_id: z.string().uuid("La habitación debe ser un UUID válido").optional(),
});

export const UpdateMuebleSchema = z.object({
  codigo: z.string().min(1, "El código es requerido").max(30, "El código no puede exceder 30 caracteres").optional(),
  nombre: z.string().min(1, "El nombre es requerido").max(100, "El nombre no puede exceder 100 caracteres").optional(),
  categoria_id: z.uuid("La categoria debe ser un UUID valido").optional(),
  imagen_url: z.string().url("Debe ser una URL válida").optional(),
  condicion: MuebleConditionSchema.optional(),
  fecha_adquisicion: z.string().date("Debe ser una fecha válida (YYYY-MM-DD)").optional(),
  ultima_revision: z.string().date("Debe ser una fecha válida (YYYY-MM-DD)").optional(),
  descripcion: z.string().optional(),
  habitacion_id: z.uuid("La habitación debe ser un UUID válido").optional(),
});

export const UUIDParamSchema = z.object({
  id: z.uuid("El ID debe ser un UUID válido"),
});
