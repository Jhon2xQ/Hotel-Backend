export interface CatalogoMueble {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
}

export interface CreateTipoHabitacionData {
  nombre: string;
  descripcion?: string | null;
  tieneDucha: boolean;
  tieneBanio: boolean;
  muebles?: CatalogoMueble[];
}

export class TipoHabitacion {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly descripcion: string | null,
    public readonly tieneDucha: boolean,
    public readonly tieneBanio: boolean,
    public readonly muebles: CatalogoMueble[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: CreateTipoHabitacionData): TipoHabitacion {
    return new TipoHabitacion(
      crypto.randomUUID(),
      data.nombre,
      data.descripcion ?? null,
      data.tieneDucha,
      data.tieneBanio,
      data.muebles ?? [],
      new Date(),
      new Date(),
    );
  }

  toOutput() {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      tiene_ducha: this.tieneDucha,
      tiene_banio: this.tieneBanio,
      muebles: this.muebles.map((mueble) => ({
        id: mueble.id,
        codigo: mueble.codigo,
        nombre: mueble.nombre,
        categoria: mueble.categoria,
      })),
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }
}
