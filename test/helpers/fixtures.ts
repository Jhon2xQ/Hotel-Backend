import { HabitationStatus } from "../../src/domain/entities/habitation.entity";

export const mockHabitacion = {
  id: "test-id-123",
  numero: "101",
  tipo: "ESTÁNDAR SIMPLE",
  piso: 1,
  precio: 100.0,
  estado: HabitationStatus.Disponible,
  created_at: new Date("2026-01-01"),
  updated_at: new Date("2026-01-01"),
};

export const mockUser = {
  id: "user-123",
  email: "admin@test.com",
  role: "ADMIN",
  name: "Test Admin",
};
