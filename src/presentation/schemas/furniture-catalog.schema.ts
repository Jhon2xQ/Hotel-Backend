import { z } from "zod";

export const FurnitureCategorySchema = z.enum([
  "CAMA",
  "ASIENTO",
  "ALMACENAJE",
  "TECNOLOGIA",
  "BANO",
  "DECORACION",
  "OTRO",
]);

export const FurnitureConditionSchema = z.enum(["BUENO", "REGULAR", "DANADO", "FALTANTE"]);

export const CreateFurnitureCatalogSchema = z.object({
  codigo: z.string().min(1, "El código es requerido").max(30, "El código no puede exceder 30 caracteres"),
  nombre: z.string().min(1, "El nombre es requerido").max(100, "El nombre no puede exceder 100 caracteres"),
  categoria: FurnitureCategorySchema,
  imagen_url: z.string().url("Debe ser una URL válida").optional(),
  tipo: z.string().max(60, "El tipo no puede exceder 60 caracteres").optional(),
  condicion: FurnitureConditionSchema.optional(),
  fecha_adquisicion: z.string().date("Debe ser una fecha válida (YYYY-MM-DD)").optional(),
  ultima_revision: z.string().date("Debe ser una fecha válida (YYYY-MM-DD)").optional(),
  descripcion: z.string().optional(),
});

export const UpdateFurnitureCatalogSchema = z.object({
  codigo: z.string().min(1, "El código es requerido").max(30, "El código no puede exceder 30 caracteres").optional(),
  nombre: z.string().min(1, "El nombre es requerido").max(100, "El nombre no puede exceder 100 caracteres").optional(),
  categoria: FurnitureCategorySchema.optional(),
  imagen_url: z.string().url("Debe ser una URL válida").optional(),
  tipo: z.string().max(60, "El tipo no puede exceder 60 caracteres").optional(),
  condicion: FurnitureConditionSchema.optional(),
  fecha_adquisicion: z.string().date("Debe ser una fecha válida (YYYY-MM-DD)").optional(),
  ultima_revision: z.string().date("Debe ser una fecha válida (YYYY-MM-DD)").optional(),
  descripcion: z.string().optional(),
});

export const UUIDParamSchema = z.object({
  id: z.uuid("El ID debe ser un UUID válido"),
});
