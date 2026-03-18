import { z } from "zod";

export const CreateTipoHabitacionSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(100, "El nombre no puede exceder 100 caracteres"),
  descripcion: z.string().optional(),
});

export const UpdateTipoHabitacionSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(100, "El nombre no puede exceder 100 caracteres").optional(),
  descripcion: z.string().optional(),
});

export const UUIDParamSchema = z.object({
  id: z.uuid("El ID debe ser un UUID válido"),
});
