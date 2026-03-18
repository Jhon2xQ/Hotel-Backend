export enum FurnitureCategory {
  Cama = "CAMA",
  Asiento = "ASIENTO",
  Almacenaje = "ALMACENAJE",
  Tecnologia = "TECNOLOGIA",
  Bano = "BANO",
  Decoracion = "DECORACION",
  Otro = "OTRO",
}

export enum FurnitureCondition {
  Bueno = "BUENO",
  Regular = "REGULAR",
  Danado = "DANADO",
  Faltante = "FALTANTE",
}

export interface CreateFurnitureCatalogData {
  codigo: string;
  nombre: string;
  categoria: FurnitureCategory;
  imagenUrl?: string | null;
  tipo?: string | null;
  condicion?: FurnitureCondition;
  fechaAdq?: Date | null;
  ultimaRevision?: Date | null;
  descripcion?: string | null;
  habitacionId?: string | null;
}

export class FurnitureCatalog {
  constructor(
    public readonly id: string,
    public readonly codigo: string,
    public readonly nombre: string,
    public readonly categoria: FurnitureCategory,
    public readonly imagenUrl: string | null,
    public readonly tipo: string | null,
    public readonly condicion: FurnitureCondition,
    public readonly fechaAdq: Date | null,
    public readonly ultimaRevision: Date | null,
    public readonly descripcion: string | null,
    public readonly habitacionId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: CreateFurnitureCatalogData): FurnitureCatalog {
    return new FurnitureCatalog(
      crypto.randomUUID(),
      data.codigo,
      data.nombre,
      data.categoria,
      data.imagenUrl ?? null,
      data.tipo ?? null,
      data.condicion ?? FurnitureCondition.Bueno,
      data.fechaAdq ?? null,
      data.ultimaRevision ?? null,
      data.descripcion ?? null,
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
      categoria: this.categoria,
      imagen_url: this.imagenUrl,
      tipo: this.tipo,
      condicion: this.condicion,
      fecha_adquisicion: this.fechaAdq?.toISOString().split("T")[0] ?? null,
      ultima_revision: this.ultimaRevision?.toISOString().split("T")[0] ?? null,
      descripcion: this.descripcion,
      habitacion_id: this.habitacionId,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }
}
