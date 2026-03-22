import z from "zod";

export const CategoriaMuebleIdSchema = z.object({
    id: z.string().uuid("El ID debe ser un UUID válido"),
});

export const CreateCategoriaMuebleSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido").max(80, "El nombre no puede exceder 80 caracteres"),
    descripcion: z.string().optional(),
    activo: z.boolean().optional(),
});

export const UpdateCategoriaMuebleSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido").max(80, "El nombre no puede exceder 80 caracteres").optional(),
    descripcion: z.string().optional(),
    activo: z.boolean().optional(),
});