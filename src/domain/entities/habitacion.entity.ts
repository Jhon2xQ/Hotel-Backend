import type { CatalogoMueble } from "./tipo-habitacion.entity";

export enum EstadoHabitacion {
  DISPONIBLE = "DISPONIBLE",
  RESERVADA = "RESERVADA",
  OCUPADA = "OCUPADA",
  LIMPIEZA = "LIMPIEZA",
  MANTENIMIENTO = "MANTENIMIENTO",
}

export enum EstadoLimpieza {
  LIMPIA = "LIMPIA",
  SUCIA = "SUCIA",
  EN_LIMPIEZA = "EN_LIMPIEZA",
  INSPECCION = "INSPECCION",
}

export interface TipoHabitacionBasic {
  id: string;
  nombre: string;
  descripcion: string | null;
}

export interface CreateHabitacionData {
  nroHabitacion: string;
  tipoId: string;
  piso: number;
  urlImagen?: string | null;
  estado?: EstadoHabitacion;
  limpieza?: EstadoLimpieza;
  notas?: string | null;
  muebles?: CatalogoMueble[];
}

export class Habitacion {
  constructor(
    public readonly id: string,
    public readonly nroHabitacion: string,
    public readonly tipoId: string,
    public readonly tipo: TipoHabitacionBasic | null,
    public readonly piso: number,
    public readonly urlImagen: string | null,
    public readonly estado: EstadoHabitacion,
    public readonly limpieza: EstadoLimpieza,
    public readonly notas: string | null,
    public readonly ultimaLimpieza: Date | null,
    public readonly muebles: CatalogoMueble[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: CreateHabitacionData): Habitacion {
    return new Habitacion(
      crypto.randomUUID(),
      data.nroHabitacion,
      data.tipoId,
      null, // tipo is loaded from database, not provided during creation
      data.piso,
      data.urlImagen ?? null,
      data.estado ?? EstadoHabitacion.DISPONIBLE,
      data.limpieza ?? EstadoLimpieza.LIMPIA,
      data.notas ?? null,
      null, // ultimaLimpieza is null on creation
      data.muebles ?? [],
      new Date(),
      new Date(),
    );
  }

  toOutput() {
    return {
      id: this.id,
      nro_habitacion: this.nroHabitacion,
      tipo_id: this.tipoId,
      tipo: this.tipo
        ? {
            id: this.tipo.id,
            nombre: this.tipo.nombre,
            descripcion: this.tipo.descripcion,
          }
        : null,
      piso: this.piso,
      url_imagen: this.urlImagen,
      estado: this.estado,
      limpieza: this.limpieza,
      notas: this.notas,
      ultima_limpieza: this.ultimaLimpieza?.toISOString() ?? null,
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
