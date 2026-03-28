export type CanalTipo = "OTA" | "DIRECTO" | "AGENTE";

export class Canal {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly tipo: CanalTipo,
    public readonly activo: boolean,
    public readonly notas: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
