export enum HabitationType {
  EstandarSimple = "ESTÁNDAR SIMPLE",
  EstandarDoble = "ESTÁNDAR DOBLE",
  Suite = "SUITE",
  SuiteJunior = "SUITE JUNIOR",
}

export enum HabitationStatus {
  Disponible = "Disponible",
  Ocupado = "Ocupado",
  Mantenimiento = "Mantenimiento",
  Reservado = "Reservado",
}

export interface CreateHabitationData {
  numero: string;
  piso: number;
  tipo: HabitationType;
  precio?: number | null;
}

export class Habitation {
  constructor(
    public readonly id: string,
    public readonly numero: string,
    public readonly piso: number,
    public readonly tipo: HabitationType,
    public readonly precio: number | null,
    public readonly estado: HabitationStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: CreateHabitationData): Habitation {
    return new Habitation(
      crypto.randomUUID(),
      data.numero,
      data.piso,
      data.tipo,
      data.precio ?? null,
      HabitationStatus.Disponible,
      new Date(),
      new Date(),
    );
  }

  toOutput() {
    return {
      id: this.id,
      numero: this.numero,
      piso: this.piso,
      tipo: this.tipo,
      precio: this.precio,
      estado: this.estado,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }
}
