import z from "zod";

export const CategoriaMuebleIdSchema = z.object({
    id: z.string().uuid("El ID debe ser un UUID válido"),
});

export const CreateCategoriaMuebleSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido").max(80, "El nombre no puede exceder 80 caracteres"),
    descripcoion: z.string().optional(),
    activo: z.boolean(),
});

export const UpdateCategoriaMuebleSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido").max(80, "El nombre no puede exceder 80 caracteres").optional(),
    descripcoion: z.string().optional(),
    activo: z.boolean().optional(),
});