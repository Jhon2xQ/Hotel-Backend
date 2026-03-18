import { z } from "zod";

export const EstadoHabitacionSchema = z.enum(["DISPONIBLE", "RESERVADA", "OCUPADA", "LIMPIEZA", "MANTENIMIENTO"]);

export const EstadoLimpiezaSchema = z.enum(["LIMPIA", "SUCIA", "EN_LIMPIEZA", "INSPECCION"]);

export const CreateHabitacionSchema = z.object({
  nro_habitacion: z
    .string()
    .min(1, "El número de habitación es requerido")
    .max(10, "El número de habitación no puede exceder 10 caracteres"),
  tipo_id: z.uuid("El tipo de habitación debe ser un UUID válido"),
  piso: z.number().int().positive("El piso debe ser un número positivo"),
  tiene_ducha: z.boolean().optional(),
  tiene_banio: z.boolean().optional(),
  url_imagen: z.string().max(255, "La URL de imagen no puede exceder 255 caracteres").optional(),
  estado: EstadoHabitacionSchema.optional(),
  limpieza: EstadoLimpiezaSchema.optional(),
  notas: z.string().optional(),
  muebles: z.array(z.uuid("Cada mueble debe ser un UUID válido")).optional(),
});

export const UpdateHabitacionSchema = z.object({
  nro_habitacion: z
    .string()
    .min(1, "El número de habitación es requerido")
    .max(10, "El número de habitación no puede exceder 10 caracteres")
    .optional(),
  tipo_id: z.uuid("El tipo de habitación debe ser un UUID válido").optional(),
  piso: z.number().int().positive("El piso debe ser un número positivo").optional(),
  tiene_ducha: z.boolean().optional(),
  tiene_banio: z.boolean().optional(),
  url_imagen: z.string().max(255, "La URL de imagen no puede exceder 255 caracteres").optional(),
  estado: EstadoHabitacionSchema.optional(),
  limpieza: EstadoLimpiezaSchema.optional(),
  notas: z.string().optional(),
  muebles: z.array(z.uuid("Cada mueble debe ser un UUID válido")).optional(),
});

export const UpdateHabitacionStatusSchema = z
  .object({
    estado: EstadoHabitacionSchema.optional(),
    limpieza: EstadoLimpiezaSchema.optional(),
  })
  .refine((data) => data.estado !== undefined || data.limpieza !== undefined, {
    message: "Debe proporcionar al menos un campo (estado o limpieza)",
  });
