export interface CreateHuespedDto {
  tipo_doc?: "DNI" | "PASAPORTE" | "RUC" | "CE";
  nro_doc?: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  nacionalidad: string;
  observacion?: string;
}

export interface UpdateHuespedDto {
  tipo_doc?: "DNI" | "PASAPORTE" | "RUC" | "CE";
  nro_doc?: string;
  nombres?: string;
  apellidos?: string;
  email?: string;
  telefono?: string;
  nacionalidad?: string;
  observacion?: string;
}

export interface HuespedOutputDto {
  id: string;
  tipo_doc: string | null;
  nro_doc: string | null;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  nacionalidad: string;
  observacion: string | null;
  created_at: string;
  updated_at: string;
}
