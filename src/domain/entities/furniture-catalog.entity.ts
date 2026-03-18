export enum FurnitureCategory {
  Cama = "CAMA",
  Asiento = "ASIENTO",
  Almacenaje = "ALMACENAJE",
  Tecnologia = "TECNOLOGIA",
  Bano = "BANO",
  Decoracion = "DECORACION",
  Otro = "OTRO",
}

export interface CreateFurnitureCatalogData {
  codigo: string;
  nombre: string;
  categoria: FurnitureCategory;
  descripcion?: string | null;
}

export class FurnitureCatalog {
  constructor(
    public readonly id: string,
    public readonly codigo: string,
    public readonly nombre: string,
    public readonly categoria: FurnitureCategory,
    public readonly descripcion: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: CreateFurnitureCatalogData): FurnitureCatalog {
    return new FurnitureCatalog(
      crypto.randomUUID(),
      data.codigo,
      data.nombre,
      data.categoria,
      data.descripcion ?? null,
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
      descripcion: this.descripcion,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }
}
