import { z } from "zod";
import { PaginationQuerySchema } from "./pagination.schema";

export const UUIDParamSchema = z.object({
  id: z.uuid("El ID debe ser un UUID válido"),
});

export const ListFolioQuerySchema = PaginationQuerySchema.extend({
  estancia_id: z.uuid("El ID de la estancia debe ser un UUID válido").optional(),
  estado: z.boolean().optional(),
});
export type ListFolioQuery = z.infer<typeof ListFolioQuerySchema>;

export const CreateFolioSchema = z
  .object({
    estancia_id: z.uuid("El ID de la estancia es requerido y debe ser un UUID válido"),
    observacion: z.string().optional(),
    promocion_ids: z.array(z.uuid("ID de promoción inválido")).optional(),
  })
  .transform((data) => ({
    estanciaId: data.estancia_id,
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

export const AddProductoSchema = z
  .object({
    producto_id: z.uuid("El ID del producto es requerido y debe ser un UUID válido"),
    cantidad: z.number().int().positive("La cantidad debe ser un número entero positivo"),
    precio_unit: z.number().positive("El precio unitario debe ser positivo"),
  })
  .transform((data) => ({
    productoId: data.producto_id,
    cantidad: data.cantidad,
    precioUnit: data.precio_unit,
  }));

export const AddServicioSchema = z
  .object({
    concepto: z.string().min(1, "El concepto es requerido"),
    cantidad: z.number().int().positive("La cantidad debe ser un número entero positivo"),
    precio_unit: z.number().positive("El precio unitario debe ser positivo"),
  })
  .transform((data) => ({
    concepto: data.concepto,
    cantidad: data.cantidad,
    precioUnit: data.precio_unit,
  }));
