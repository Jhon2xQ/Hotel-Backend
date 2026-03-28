export enum MuebleCondition {
  Bueno = "BUENO",
  Regular = "REGULAR",
  Danado = "DANADO",
  Faltante = "FALTANTE",
}

export class Mueble {
  constructor(
    public readonly id: string,
    public readonly codigo: string,
    public readonly nombre: string,
    public readonly descripcion: string | null,
    public readonly categoriaId: string,
    public readonly imagenUrl: string | null,
    public readonly condicion: MuebleCondition,
    public readonly fechaAdq: Date | null,
    public readonly ultimaRevision: Date | null,
    public readonly habitacionId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
