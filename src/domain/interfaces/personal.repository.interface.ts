export interface IPersonalRepository {
  findById(id: string): Promise<{ id: string; codigo: string; nombres: string; apellidos: string } | null>;
}
