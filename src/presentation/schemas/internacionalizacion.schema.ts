import { z } from "zod";

export const CreateInternacionalizacionSchema = z.object({
  descripcion_en: z.string().optional(),
  descripcion_fr: z.string().optional(),
  feature_en: z.string().optional(),
  feature_fr: z.string().optional(),
  amenities_en: z.string().optional(),
  amenities_fr: z.string().optional(),
});

export const UpdateInternacionalizacionSchema = z.object({
  descripcion_en: z.string().optional().nullable(),
  descripcion_fr: z.string().optional().nullable(),
  feature_en: z.string().optional().nullable(),
  feature_fr: z.string().optional().nullable(),
  amenities_en: z.string().optional().nullable(),
  amenities_fr: z.string().optional().nullable(),
});