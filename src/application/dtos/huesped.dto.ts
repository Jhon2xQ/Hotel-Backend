export interface CreateHuespedDto {
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  nacionalidad: string;
  nivelVip?: number;
  notas?: string;
}

export interface UpdateHuespedDto {
  nombres?: string;
  apellidos?: string;
  email?: string;
  telefono?: string;
  nacionalidad?: string;
  nivelVip?: number;
  notas?: string;
}

export interface HuespedOutputDto {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  nacionalidad: string;
  nivel_vip: number;
  notas: string | null;
  created_at: string;
  updated_at: string;
}
