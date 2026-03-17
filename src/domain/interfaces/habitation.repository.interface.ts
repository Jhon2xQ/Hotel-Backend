import { Habitation, HabitationStatus, CreateHabitationData } from "../entities/habitation.entity";

export interface UpdateHabitationData {
  numero?: string;
  piso?: number;
  tipo?: string;
  precio?: number | null;
  estado?: HabitationStatus;
}

export interface IHabitationRepository {
  create(data: CreateHabitationData): Promise<Habitation>;
  findAll(): Promise<Habitation[]>;
  findById(id: string): Promise<Habitation | null>;
  findByNumero(numero: string): Promise<Habitation | null>;
  update(id: string, data: UpdateHabitationData): Promise<Habitation>;
  delete(id: string): Promise<void>;
}
