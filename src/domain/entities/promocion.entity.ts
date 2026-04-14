export class Promocion {
  constructor(
    public readonly id: string,
    public readonly codigo: string,
    public readonly tipoDescuento: string,
    public readonly valorDescuento: number,
    public readonly vigDesde: Date,
    public readonly vigHasta: Date,
    public readonly estado: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
