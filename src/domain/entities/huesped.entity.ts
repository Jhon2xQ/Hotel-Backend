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
}
