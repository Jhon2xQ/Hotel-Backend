import { z } from "zod";
import { PaginationQuerySchema } from "./pagination.schema";

export const ListHabitacionQuerySchema = PaginationQuerySchema.extend({
  tipo: z.string().optional(),
});
export type ListHabitacionQuery = z.infer<typeof ListHabitacionQuerySchema>;

const ESTADOS_RESERVA = ["TENTATIVA", "CONFIRMADA", "EN_CASA", "COMPLETADA", "CANCELADA", "NO_LLEGO"] as const;
const ESTADOS_RESERVA_DEFAULT: readonly string[] = ["TENTATIVA", "CONFIRMADA", "EN_CASA"];

export const HabitacionDetailQuerySchema = z.object({
  tipo_reserva: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return [...ESTADOS_RESERVA_DEFAULT];
      const estados = val.split(",").map((s) => s.trim().toUpperCase());
      const valid = estados.filter((e) => (ESTADOS_RESERVA as readonly string[]).includes(e));
      return valid.length > 0 ? valid : [...ESTADOS_RESERVA_DEFAULT];
    }),
});
export type HabitacionDetailQuery = z.infer<typeof HabitacionDetailQuerySchema>;

export const EstadoLimpiezaSchema = z.enum(["LIMPIA", "SUCIA", "EN_LIMPIEZA", "INSPECCION"]);

export const CreateHabitacionSchema = z.object({
  nro_habitacion: z
    .string()
    .min(1, "El número de habitación es requerido")
    .max(10, "El número de habitación no puede exceder 10 caracteres"),
  tipo_habitacion_id: z.uuid("El tipo de habitación debe ser un UUID válido"),
  piso: z.number().int().positive("El piso debe ser un número positivo"),
  tiene_ducha: z.boolean().optional(),
  tiene_banio: z.boolean().optional(),
  imagenes: z.array(z.instanceof(File)).optional().default([]),
  estado: z.boolean().optional(),
  descripcion: z.string().optional(),
});

export const UpdateHabitacionSchema = z.object({
  nro_habitacion: z
    .string()
    .min(1, "El número de habitación es requerido")
    .max(10, "El número de habitación no puede exceder 10 caracteres")
    .optional(),
  tipo_habitacion_id: z.uuid("El tipo de habitación debe ser un UUID válido").optional(),
  piso: z.number().int().positive("El piso debe ser un número positivo").optional(),
  tiene_ducha: z.boolean().optional(),
  tiene_banio: z.boolean().optional(),
  imagenes: z.array(z.instanceof(File)).optional().default([]),
  estado: z.boolean().optional(),
  descripcion: z.string().optional(),
});

export const UpdateHabitacionStatusSchema = z.object({
  estado: z.boolean({ message: "El estado debe ser un valor booleano" }),
});

export const SearchAvailableHabitacionesSchema = z
  .object({
    tipo: z.string().optional(),
    fecha_inicio: z.string().datetime({ message: "fecha_inicio debe ser una fecha ISO válida" }).optional(),
    fecha_fin: z.string().datetime({ message: "fecha_fin debe ser una fecha ISO válida" }).optional(),
    orden_precio: z.enum(["asc", "desc"]).optional(),
  })
  .refine(
    (data) => {
      if (data.fecha_inicio && data.fecha_fin) {
        return new Date(data.fecha_inicio) < new Date(data.fecha_fin);
      }
      return true;
    },
    {
      message: "fecha_inicio debe ser anterior a fecha_fin",
    },
  )
  .transform((data) => ({
    ...data,
    fecha_inicio: data.fecha_inicio ? new Date(data.fecha_inicio) : undefined,
    fecha_fin: data.fecha_fin ? new Date(data.fecha_fin) : undefined,
  }));
