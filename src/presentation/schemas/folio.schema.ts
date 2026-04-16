import { z } from "zod";
import { PaginationQuerySchema } from "./pagination.schema";

export const UUIDParamSchema = z.object({
  id: z.uuid("El ID debe ser un UUID válido"),
});

export const ListFolioQuerySchema = PaginationQuerySchema.extend({
  reserva_id: z.uuid("El ID de la reserva debe ser un UUID válido").optional(),
  estado: z.boolean().optional(),
});
export type ListFolioQuery = z.infer<typeof ListFolioQuerySchema>;

export const CreateFolioSchema = z
  .object({
    reserva_id: z.uuid("El ID de la reserva es requerido y debe ser un UUID válido"),
    observacion: z.string().optional(),
    promocion_ids: z.array(z.uuid("ID de promoción inválido")).optional(),
  })
  .transform((data) => ({
    reservaId: data.reserva_id,
    observacion: data.observacion,
    promocionIds: data.promocion_ids,
  }));

export const UpdateFolioSchema = z
  .object({
    estado: z.boolean().optional(),
    observacion: z.string().optional(),
    promocion_ids: z.array(z.uuid("ID de promoción inválido")).optional(),
  })
  .transform((data) => ({
    ...data,
  }));

export const CloseFolioSchema = z
  .object({
    observacion: z.string().optional(),
  })
  .transform((data) => ({
    observacion: data.observacion,
  }));