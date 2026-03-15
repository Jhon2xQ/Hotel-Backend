import { z } from "zod";

export const HabitationTypeSchema = z.enum(["ESTÁNDAR SIMPLE", "ESTÁNDAR DOBLE", "SUITE", "SUITE JUNIOR"]);

export const HabitationStatusSchema = z.enum(["Disponible", "Ocupado", "Mantenimiento", "Reservado"]);

export const CreateHabitationSchema = z.object({
  numero: z.string().min(1, "El número de habitación es requerido"),
  piso: z.number().int().positive("El piso debe ser un número positivo"),
  tipo: HabitationTypeSchema,
  precio: z.number().positive().multipleOf(0.01).optional(),
});

export const UpdateHabitationSchema = z.object({
  numero: z.string().min(1, "El número de habitación es requerido"),
  piso: z.number().int().positive("El piso debe ser un número positivo"),
  tipo: HabitationTypeSchema,
  precio: z.number().positive().multipleOf(0.01).optional(),
  estado: HabitationStatusSchema,
});

export const UpdateHabitationStatusSchema = z.object({
  estado: HabitationStatusSchema,
});

export const UUIDParamSchema = z.object({
  id: z.uuid("El ID debe ser un UUID válido"),
});
