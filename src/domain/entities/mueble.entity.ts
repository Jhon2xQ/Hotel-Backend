export enum MuebleCondition {
  Bueno = "BUENO",
  Regular = "REGULAR",
  Danado = "DANADO",
  Faltante = "FALTANTE",
}

export interface CreateMuebleData {
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  categoriaId: string;
  imagenUrl?: string | null;
  condicion?: MuebleCondition;
  fechaAdq?: Date | null;
  ultimaRevision?: Date | null;
  habitacionId?: string | null;
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

  static create(data: CreateMuebleData): Mueble {
    return new Mueble(
      crypto.randomUUID(),
      data.codigo,
      data.nombre,
      data.descripcion ?? null,
      data.categoriaId,
      data.imagenUrl ?? null,
      data.condicion ?? MuebleCondition.Bueno,
      data.fechaAdq ?? null,
      data.ultimaRevision ?? null,
      data.habitacionId ?? null,
      new Date(),
      new Date(),
    );
  }

  toOutput() {
    return {
      id: this.id,
      codigo: this.codigo,
      nombre: this.nombre,
      descripcion: this.descripcion,
      categoria_id: this.categoriaId,
      imagen_url: this.imagenUrl,
      condicion: this.condicion,
      fecha_adquisicion: this.fechaAdq?.toISOString().split("T")[0] ?? null,
      ultima_revision: this.ultimaRevision?.toISOString().split("T")[0] ?? null,
      habitacion_id: this.habitacionId,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }
}
