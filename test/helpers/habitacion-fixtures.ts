import {
  Habitacion,
  EstadoHabitacion,
  EstadoLimpieza,
  TipoHabitacionBasic,
} from "../../src/domain/entities/habitacion.entity";
import { CatalogoMueble } from "../../src/domain/entities/tipo-habitacion.entity";

export const mockTipoBasic: TipoHabitacionBasic = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  nombre: "Suite Deluxe",
  descripcion: "Suite de lujo con vista panorámica",
};

export const mockMueblesHabitacion: CatalogoMueble[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    codigo: "CAMA-KING-01",
    nombre: "Cama King Size",
    categoria: "CAMA",
  },
];

export const mockHabitacion = new Habitacion(
  "789e4567-e89b-12d3-a456-426614174000",
  "301",
  "123e4567-e89b-12d3-a456-426614174000",
  mockTipoBasic,
  3,
  "https://example.com/rooms/301.jpg",
  EstadoHabitacion.DISPONIBLE,
  EstadoLimpieza.LIMPIA,
  null,
  null,
  mockMueblesHabitacion,
  new Date("2026-03-17T15:00:00.000Z"),
  new Date("2026-03-17T15:00:00.000Z"),
);

export const mockHabitacionOutput = {
  id: "789e4567-e89b-12d3-a456-426614174000",
  nro_habitacion: "301",
  tipo_id: "123e4567-e89b-12d3-a456-426614174000",
  tipo: mockTipoBasic,
  piso: 3,
  url_imagen: "https://example.com/rooms/301.jpg",
  estado: "DISPONIBLE",
  limpieza: "LIMPIA",
  notas: null,
  ultima_limpieza: null,
  muebles: mockMueblesHabitacion,
  created_at: "2026-03-17T15:00:00.000Z",
  updated_at: "2026-03-17T15:00:00.000Z",
};
