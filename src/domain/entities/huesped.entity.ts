export interface CreateHuespedData {
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  nacionalidad: string;
  nivelVip?: number;
  notas?: string | null;
}

export class Huesped {
  constructor(
    public readonly id: string,
    public readonly nombres: string,
    public readonly apellidos: string,
    public readonly email: string,
    public readonly telefono: string,
    public readonly nacionalidad: string,
    public readonly nivelVip: number,
    public readonly notas: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: CreateHuespedData): Huesped {
    const now = new Date();
    return new Huesped(
      crypto.randomUUID(),
      data.nombres,
      data.apellidos,
      data.email,
      data.telefono,
      data.nacionalidad,
      data.nivelVip ?? 0,
      data.notas ?? null,
      now,
      now,
    );
  }

  toOutput() {
    return {
      id: this.id,
      nombres: this.nombres,
      apellidos: this.apellidos,
      email: this.email,
      telefono: this.telefono,
      nacionalidad: this.nacionalidad,
      nivel_vip: this.nivelVip,
      notas: this.notas,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }
}
