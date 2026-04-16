export class Producto {
  constructor(
    public readonly id: string,
    public readonly codigo: string,
    public readonly nombre: string,
    public readonly descripcion: string | null,
    public readonly precioUnitario: number,
    public readonly stock: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}