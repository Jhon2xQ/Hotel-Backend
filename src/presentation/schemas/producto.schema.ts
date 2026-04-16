import { z } from "zod";

export const CreateProductoSchema = z.object({
  codigo: z.string().min(1, "El código es requerido").max(30, "El código no puede exceder 30 caracteres"),
  nombre: z.string().min(1, "El nombre es requerido").max(150, "El nombre no puede exceder 150 caracteres"),
  descripcion: z.string().optional(),
  precio_unitario: z
    .number({ message: "El precio unitario debe ser un número" })
    .min(0, "El precio unitario debe ser mayor o igual a 0")
    .max(9999.99, "El precio unitario no puede exceder 9999.99"),
  stock: z.number().int("El stock debe ser un número entero").min(0, "El stock debe ser mayor o igual a 0").optional(),
});

export const UpdateProductoSchema = z.object({
  codigo: z.string().min(1, "El código es requerido").max(30, "El código no puede exceder 30 caracteres").optional(),
  nombre: z.string().min(1, "El nombre es requerido").max(150, "El nombre no puede exceder 150 caracteres").optional(),
  descripcion: z.string().optional(),
  precio_unitario: z
    .number({ message: "El precio unitario debe ser un número" })
    .min(0, "El precio unitario debe ser mayor o igual a 0")
    .max(9999.99, "El precio unitario no puede exceder 9999.99")
    .optional(),
  stock: z.number().int("El stock debe ser un número entero").min(0, "El stock debe ser mayor o igual a 0").optional(),
});

export const UUIDParamSchema = z.object({
  id: z.uuid("El ID debe ser un UUID válido"),
});