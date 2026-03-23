import { Canal, CreateCanalData } from "../entities/canal.entity";

export interface UpdateCanalData {
  nombre?: string;
  tipo?: "OTA" | "DIRECTO" | "AGENTE";
  activo?: boolean;
  notas?: string | null;
}

export interface ICanalRepository {
  create(data: CreateCanalData): Promise<Canal>;
  findAll(): Promise<Canal[]>;
  findById(id: string): Promise<Canal | null>;
  update(id: string, data: UpdateCanalData): Promise<Canal>;
  delete(id: string): Promise<void>;
  hasRelatedRecords(id: string): Promise<boolean>;
  findByName(nombre: string): Promise<Canal | null>;
}
