export class CategoriaMueble {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly descripcion: string | null,
    public readonly activo: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
