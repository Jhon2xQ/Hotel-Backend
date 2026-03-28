export enum EstadoHabitacion {
  DISPONIBLE = "DISPONIBLE",
  RESERVADA = "RESERVADA",
  OCUPADA = "OCUPADA",
  LIMPIEZA = "LIMPIEZA",
  MANTENIMIENTO = "MANTENIMIENTO",
}

export class Habitacion {
  constructor(
    public readonly id: string,
    public readonly nroHabitacion: string,
    public readonly tipoHabitacionId: string,
    public readonly tipo: { id: string; nombre: string; descripcion: string | null } | null,
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
}
