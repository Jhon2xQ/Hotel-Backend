import { z } from "zod";
import { PaginationQuerySchema } from "./pagination.schema";

export const MuebleConditionSchema = z.enum(["BUENO", "REGULAR", "DANADO", "FALTANTE"]);

export const ListMuebleQuerySchema = PaginationQuerySchema.extend({
  codigo: z.string().optional(),
  categoria: z.string().optional(),
  condicion: MuebleConditionSchema.optional(),
});

export type ListMuebleQuery = z.infer<typeof ListMuebleQuerySchema>;

export const CreateMuebleSchema = z.object({
  codigo: z
    .union([z.string(), z.number()])
    .transform((val) => String(val))
    .pipe(z.string().min(1, "El código es requerido").max(30, "El código no puede exceder 30 caracteres")),
  nombre: z.string().min(1, "El nombre es requerido").max(100, "El nombre no puede exceder 100 caracteres"),
  categoria_id: z.string().uuid("La categoria debe ser un UUID valido"),
  imagen: z.array(z.instanceof(File)).optional(),
  condicion: MuebleConditionSchema.optional(),
  fecha_adquisicion: z.string().date("Debe ser una fecha válida (YYYY-MM-DD)").optional(),
  ultima_revision: z.string().date("Debe ser una fecha válida (YYYY-MM-DD)").optional(),
  descripcion: z.string().optional(),
  habitacion_id: z.union([
    z.string().uuid("La habitación debe ser un UUID válido"),
    z.string().max(0)
  ]).optional(),
});

export const UpdateMuebleSchema = z.object({
  codigo: z
    .union([z.string(), z.number()])
    .transform((val) => String(val))
    .pipe(z.string().min(1, "El código es requerido").max(30, "El código no puede exceder 30 caracteres"))
    .optional(),
  nombre: z.string().min(1, "El nombre es requerido").max(100, "El nombre no puede exceder 100 caracteres").optional(),
  categoria_id: z.uuid("La categoria debe ser un UUID valido").optional(),
  imagen: z.union([z.array(z.instanceof(File)), z.string().max(0)]).optional().default([]),
  condicion: MuebleConditionSchema.optional(),
  fecha_adquisicion: z.string().date("Debe ser una fecha válida (YYYY-MM-DD)").optional(),
  ultima_revision: z.string().date("Debe ser una fecha válida (YYYY-MM-DD)").optional(),
  descripcion: z.string().optional(),
  habitacion_id: z.union([
    z.string().uuid("La habitación debe ser un UUID válido"),
    z.string().max(0)
  ]).optional(),
});

export const UUIDParamSchema = z.object({
  id: z.uuid("El ID debe ser un UUID válido"),
});
