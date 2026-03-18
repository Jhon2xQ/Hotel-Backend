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

export const CreateFurnitureCatalogSchema = z.object({
  codigo: z.string().min(1, "El código es requerido").max(30, "El código no puede exceder 30 caracteres"),
  nombre: z.string().min(1, "El nombre es requerido").max(100, "El nombre no puede exceder 100 caracteres"),
  categoria: FurnitureCategorySchema,
  descripcion: z.string().max(500, "La descripción no puede exceder 500 caracteres").optional(),
});

export const UpdateFurnitureCatalogSchema = z.object({
  codigo: z.string().min(1, "El código es requerido").max(30, "El código no puede exceder 30 caracteres").optional(),
  nombre: z.string().min(1, "El nombre es requerido").max(100, "El nombre no puede exceder 100 caracteres").optional(),
  categoria: FurnitureCategorySchema.optional(),
  descripcion: z.string().max(500, "La descripción no puede exceder 500 caracteres").optional(),
});

export const UUIDParamSchema = z.object({
  id: z.uuid("El ID debe ser un UUID válido"),
});
