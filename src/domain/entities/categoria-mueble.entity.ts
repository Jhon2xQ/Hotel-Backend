export interface CreateCategoriaMuebleData {
    nombre: string;
    descripcion?: string | null;
    activo?: boolean;
}

export class CategoriaMueble {
  constructor(
        public readonly id: string,
        public readonly nombre: string,
        public readonly descripcion: string | null,
        public readonly activo: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
  ) {}

  static create(data: CreateCategoriaMuebleData): CategoriaMueble {
    const now = new Date();
    return new CategoriaMueble(
        crypto.randomUUID(),
        data.nombre,
        data.descripcion ?? null,
        data.activo ?? true,
        now,
        now,
    );
  }

    toOutput() {
        return {
            id: this.id,
            nombre: this.nombre,
            descripcion: this.descripcion,
            activo: this.activo,
            created_at: this.createdAt.toISOString(),
            updated_at: this.updatedAt.toISOString(),
        };
    }
}