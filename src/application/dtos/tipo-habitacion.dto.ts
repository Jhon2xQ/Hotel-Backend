export interface CreateTipoHabitacionInput {
  nombre: string;
  descripcion?: string;
}

export interface UpdateTipoHabitacionInput {
  nombre?: string;
  descripcion?: string;
}

export interface TipoHabitacionOutput {
  id: string;
  nombre: string;
  descripcion: string | null;
  created_at: string;
  updated_at: string;
}
