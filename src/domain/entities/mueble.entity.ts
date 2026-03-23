import { CategoriaMueble } from "./categoria-mueble.entity";

export enum MuebleCondition {
  Bueno = "BUENO",
  Regular = "REGULAR",
  Danado = "DANADO",
  Faltante = "FALTANTE",
}

export interface CategoriaMuebleBasic {
  id: string;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
}

export interface HabitacionBasic {
  id: string;
  nroHabitacion: string;
  piso: number;
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
  habitacionId: string;
}

export class Mueble
 {
  constructor(
    public readonly id: string,
    public readonly codigo: string,
    public readonly nombre: string,
    public readonly descripcion: string | null,
    public readonly categoriaId: string,
    public readonly categoria: CategoriaMuebleBasic | null,
    public readonly imagenUrl: string | null,
    public readonly condicion: MuebleCondition,
    public readonly fechaAdq: Date | null,
    public readonly ultimaRevision: Date | null, 
    public readonly habitacionId: string,
    public readonly habitacion: HabitacionBasic | null,
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
      null,
      data.imagenUrl ?? null,
      data.condicion ?? MuebleCondition.Bueno,
      data.fechaAdq ?? null,
      data.ultimaRevision ?? null,
      data.habitacionId,
      null,
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
      categoria: this.categoria 
      ? {
        id: this.categoria.id,
        nombre: this.categoria.nombre,
        descripcion: this.categoria.descripcion,
        activo: this.categoria.activo,
      } : null,
      imagen_url: this.imagenUrl,
      condicion: this.condicion,
      fecha_adquisicion: this.fechaAdq?.toISOString().split("T")[0] ?? null,
      ultima_revision: this.ultimaRevision?.toISOString().split("T")[0] ?? null,
      habitacion_id: this.habitacionId,
      habitacion: this.habitacion      
      ? {
        id: this.habitacion.id,
        nro_habitacion: this.habitacion.nroHabitacion,
        piso: this.habitacion.piso,
      } : null,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }
}
