import type { Canal } from "../entities/canal.entity";

export interface CreateCanalParams {
  nombre: string;
  tipo: "OTA" | "DIRECTO" | "AGENTE";
  activo?: boolean;
  notas?: string | null;
}

export interface UpdateCanalParams {
  nombre?: string;
  tipo?: "OTA" | "DIRECTO" | "AGENTE";
  activo?: boolean;
  notas?: string | null;
}

export interface ICanalRepository {
  create(data: CreateCanalParams): Promise<Canal>;
  findAll(): Promise<Canal[]>;
  findById(id: string): Promise<Canal | null>;
  update(id: string, data: UpdateCanalParams): Promise<Canal>;
  delete(id: string): Promise<void>;
  hasRelatedRecords(id: string): Promise<boolean>;
  findByName(nombre: string): Promise<Canal | null>;
}
