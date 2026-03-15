import { HabitationType, HabitationStatus } from "../../domain/entities/habitation.entity";

export interface CreateHabitationInput {
  numero: string;
  piso: number;
  tipo: HabitationType;
  precio?: number;
}

export interface UpdateHabitationInput {
  numero: string;
  piso: number;
  tipo: HabitationType;
  precio?: number;
  estado: HabitationStatus;
}

export interface UpdateHabitationStatusInput {
  estado: HabitationStatus;
}

export interface HabitationOutput {
  id: string;
  numero: string;
  piso: number;
  tipo: string;
  precio: number | null;
  estado: string;
  created_at: string;
  updated_at: string;
}
