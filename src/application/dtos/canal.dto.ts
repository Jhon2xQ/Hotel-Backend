export interface CreateCanalInput {
  nombre: string;
  tipo: "OTA" | "DIRECTO" | "AGENTE";
  activo?: boolean;
  notas?: string;
}

export interface UpdateCanalInput {
  nombre?: string;
  tipo?: "OTA" | "DIRECTO" | "AGENTE";
  activo?: boolean;
  notas?: string;
}

export interface CanalOutput {
  id: string;
  nombre: string;
  tipo: "OTA" | "DIRECTO" | "AGENTE";
  activo: boolean;
  notas: string | null;
  created_at: string;
  updated_at: string;
}
