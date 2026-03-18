export interface CreateTipoHabitacionInput {
  nombre: string;
  descripcion?: string;
  tiene_ducha: boolean;
  tiene_banio: boolean;
  muebles?: string[];
}

export interface UpdateTipoHabitacionInput {
  nombre?: string;
  descripcion?: string;
  tiene_ducha?: boolean;
  tiene_banio?: boolean;
  muebles?: string[];
}

export interface TipoHabitacionOutput {
  id: string;
  nombre: string;
  descripcion: string | null;
  tiene_ducha: boolean;
  tiene_banio: boolean;
  muebles: {
    id: string;
    codigo: string;
    nombre: string;
    categoria: string;
  }[];
  created_at: string;
  updated_at: string;
}
