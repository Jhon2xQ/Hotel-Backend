import { TipoHabitacion, CatalogoMueble } from "../../src/domain/entities/tipo-habitacion.entity";

export const mockMuebles: CatalogoMueble[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    codigo: "CAMA-KING-01",
    nombre: "Cama King Size",
    categoria: "CAMA",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    codigo: "TV-55-01",
    nombre: "TV 55 pulgadas",
    categoria: "TECNOLOGIA",
  },
];

export const mockTipoHabitacion = new TipoHabitacion(
  "123e4567-e89b-12d3-a456-426614174000",
  "Suite Deluxe",
  "Suite de lujo con vista panorámica",
  true,
  true,
  mockMuebles,
  new Date("2026-03-17T10:00:00.000Z"),
  new Date("2026-03-17T10:00:00.000Z"),
);

export const mockTipoHabitacionOutput = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  nombre: "Suite Deluxe",
  descripcion: "Suite de lujo con vista panorámica",
  tiene_ducha: true,
  tiene_banio: true,
  muebles: mockMuebles,
  created_at: "2026-03-17T10:00:00.000Z",
  updated_at: "2026-03-17T10:00:00.000Z",
};
