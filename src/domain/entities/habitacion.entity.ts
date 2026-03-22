export enum EstadoHabitacion {
  DISPONIBLE = "DISPONIBLE",
  RESERVADA = "RESERVADA",
  OCUPADA = "OCUPADA",
  LIMPIEZA = "LIMPIEZA",
  MANTENIMIENTO = "MANTENIMIENTO",
}

export interface TipoHabitacionBasic {
  id: string;
  nombre: string;
  descripcion: string | null;
}

export interface CreateHabitacionData {
  nroHabitacion: string;
  tipoHabitacionId: string;
  piso: number;
  tieneDucha?: boolean;
  tieneBanio?: boolean;
  urlImagen?: string[] | null;
  estado?: EstadoHabitacion;
  notas?: string | null;
  ultiLimpieza?: Date | null;
}

export class Habitacion {
  constructor(
    public readonly id: string,
    public readonly nroHabitacion: string,
    public readonly tipoHabitacionId: string,
    public readonly tipo: TipoHabitacionBasic | null,
    public readonly piso: number,
    public readonly tieneDucha: boolean,
    public readonly tieneBanio: boolean,
    public readonly urlImagen: string[] | null,
    public readonly estado: EstadoHabitacion,
    public readonly notas: string | null,
    public readonly ultiLimpieza: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: CreateHabitacionData): Habitacion {
    return new Habitacion(
      crypto.randomUUID(),
      data.nroHabitacion,
      data.tipoHabitacionId,
      null, // tipo is loaded from database, not provided during creation
      data.piso,
      data.tieneDucha ?? false,
      data.tieneBanio ?? false,
      data.urlImagen ?? null,
      data.estado ?? EstadoHabitacion.DISPONIBLE,
      data.notas ?? null,
      data.ultiLimpieza ?? null, 
      new Date(),
      new Date(),
    );
  }

  toOutput() {
    return {
      id: this.id,
      nro_habitacion: this.nroHabitacion,
      tipo_habitacion_id: this.tipoHabitacionId,
      tipo: this.tipo
        ? {
            id: this.tipo.id,
            nombre: this.tipo.nombre,
            descripcion: this.tipo.descripcion,
          }
        : null,
      piso: this.piso,
      tiene_ducha: this.tieneDucha,
      tiene_banio: this.tieneBanio,
      url_imagen: this.urlImagen,
      estado: this.estado,
      notas: this.notas,
      ulti_limpieza: this.ultiLimpieza?.toISOString() ?? null,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }
}
