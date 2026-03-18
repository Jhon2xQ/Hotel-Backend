export interface CatalogoMueble {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
}

export interface CreateTipoHabitacionData {
  nombre: string;
  descripcion?: string | null;
}

export class TipoHabitacion {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly descripcion: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: CreateTipoHabitacionData): TipoHabitacion {
    return new TipoHabitacion(crypto.randomUUID(), data.nombre, data.descripcion ?? null, new Date(), new Date());
  }

  toOutput() {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }
}
