export interface CreateHuespedData {
  tipo_doc?: "DNI" | "PASAPORTE" | "RUC" | "CE" | null;
  nro_doc?: string | null;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  nacionalidad: string;
  observacion?: string | null;
}

export class Huesped {
  constructor(
    public readonly id: string,
    public readonly tipo_doc: string | null,
    public readonly nro_doc: string | null,
    public readonly nombres: string,
    public readonly apellidos: string,
    public readonly email: string,
    public readonly telefono: string,
    public readonly nacionalidad: string,
    public readonly observacion: string | null,
    public readonly created_at: Date,
    public readonly updated_at: Date,
  ) {}

  static create(data: CreateHuespedData): Huesped {
    const now = new Date();
    return new Huesped(
      crypto.randomUUID(),
      data.tipo_doc ?? null,
      data.nro_doc ?? null,
      data.nombres,
      data.apellidos,
      data.email,
      data.telefono,
      data.nacionalidad,
      data.observacion ?? null,
      now,
      now,
    );
  }

  toOutput() {
    return {
      id: this.id,
      tipo_doc: this.tipo_doc,
      nro_doc: this.nro_doc,
      nombres: this.nombres,
      apellidos: this.apellidos,
      email: this.email,
      telefono: this.telefono,
      nacionalidad: this.nacionalidad,
      observacion: this.observacion,
      created_at: this.created_at.toISOString(),
      updated_at: this.updated_at.toISOString(),
    };
  }
}
