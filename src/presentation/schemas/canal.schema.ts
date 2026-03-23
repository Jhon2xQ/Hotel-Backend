import { z } from "zod";

export const CreateCanalSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  tipo: z.enum(["OTA", "DIRECTO", "AGENTE"], {
    message: "El tipo debe ser OTA, DIRECTO o AGENTE",
  }),
  activo: z.boolean().optional(),
  notas: z.string().optional(),
});

export const UpdateCanalSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").optional(),
  tipo: z
    .enum(["OTA", "DIRECTO", "AGENTE"], {
      message: "El tipo debe ser OTA, DIRECTO o AGENTE",
    })
    .optional(),
  activo: z.boolean().optional(),
  notas: z.string().optional(),
});

export const UUIDParamSchema = z.object({
  id: z.uuid("El ID debe ser un UUID válido"),
});
