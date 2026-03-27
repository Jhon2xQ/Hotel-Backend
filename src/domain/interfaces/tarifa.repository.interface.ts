import { Tarifa, CreateTarifaData } from "../entities/tarifa.entity";

export interface UpdateTarifaData {
  tipoHabitacionId?: string;
  canalId?: string;
  precioNoche?: number;
  IVA?: number | null;
  cargoServicios?: number | null;
  moneda?: string;
}

export interface ITarifaRepository {
  create(data: CreateTarifaData): Promise<Tarifa>;
  findAll(): Promise<Tarifa[]>;
  findById(id: string): Promise<Tarifa | null>;
  update(id: string, data: UpdateTarifaData): Promise<Tarifa>;
  delete(id: string): Promise<void>;
  hasRelatedRecords(id: string): Promise<boolean>;
  findByTipoHabitacionAndCanal(tipoHabitacionId: string, canalId: string): Promise<Tarifa[]>;
  tipoHabitacionExists(id: string): Promise<boolean>;
  canalExists(id: string): Promise<boolean>;
}
