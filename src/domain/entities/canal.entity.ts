export interface CreateCanalData {
  nombre: string;
  tipo: "OTA" | "DIRECTO" | "AGENTE";
  activo?: boolean;
  notas?: string | null;
}

export class Canal {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly tipo: "OTA" | "DIRECTO" | "AGENTE",
    public readonly activo: boolean,
    public readonly notas: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: CreateCanalData): Canal {
    return new Canal(
      crypto.randomUUID(),
      data.nombre,
      data.tipo,
      data.activo ?? true,
      data.notas ?? null,
      new Date(),
      new Date(),
    );
  }

  toOutput() {
    return {
      id: this.id,
      nombre: this.nombre,
      tipo: this.tipo,
      activo: this.activo,
      notas: this.notas,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }
}
