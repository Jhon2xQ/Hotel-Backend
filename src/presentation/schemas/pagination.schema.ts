import { z } from "zod";

export const PaginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => Number.parseInt(val, 10))
    .refine((val) => val > 0, "La página debe ser mayor a 0"),
  limit: z
    .string()
    .optional()
    .default("10")
    .transform((val) => Number.parseInt(val, 10))
    .refine((val) => val > 0 && val <= 100, "El límite debe estar entre 1 y 100"),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
