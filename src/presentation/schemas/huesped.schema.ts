import { z } from "zod";

export const HuespedIdSchema = z.object({
  id: z.string().uuid("El ID debe ser un UUID válido"),
});

export const CreateHuespedSchema = z.object({
  tipo_doc: z.enum(["DNI", "PASAPORTE", "RUC", "CE"]).optional(),
  nro_doc: z.string().max(20, "El número de documento no puede exceder 20 caracteres").optional(),
  nombres: z.string().min(1, "Los nombres son requeridos").max(80, "Los nombres no pueden exceder 80 caracteres"),
  apellidos: z.string().min(1, "Los apellidos son requeridos").max(80, "Los apellidos no pueden exceder 80 caracteres"),
  email: z.email("El email debe ser válido").max(120, "El email no puede exceder 120 caracteres"),
  telefono: z.string().min(1, "El teléfono es requerido").max(20, "El teléfono no puede exceder 20 caracteres"),
  nacionalidad: z
    .string()
    .min(1, "La nacionalidad es requerida")
    .max(60, "La nacionalidad no puede exceder 60 caracteres"),
  observacion: z.string().optional(),
});

export const UpdateHuespedSchema = z.object({
  tipo_doc: z.enum(["DNI", "PASAPORTE", "RUC", "CE"]).optional(),
  nro_doc: z.string().max(20, "El número de documento no puede exceder 20 caracteres").optional(),
  nombres: z
    .string()
    .min(1, "Los nombres son requeridos")
    .max(80, "Los nombres no pueden exceder 80 caracteres")
    .optional(),
  apellidos: z
    .string()
    .min(1, "Los apellidos son requeridos")
    .max(80, "Los apellidos no pueden exceder 80 caracteres")
    .optional(),
  email: z.email("El email debe ser válido").max(120, "El email no puede exceder 120 caracteres").optional(),
  telefono: z
    .string()
    .min(1, "El teléfono es requerido")
    .max(20, "El teléfono no puede exceder 20 caracteres")
    .optional(),
  nacionalidad: z
    .string()
    .min(1, "La nacionalidad es requerida")
    .max(60, "La nacionalidad no puede exceder 60 caracteres")
    .optional(),
  observacion: z.string().optional(),
});
