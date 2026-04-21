export class Folio {
  constructor(
    public readonly id: string,
    public readonly codigo: string,
    public readonly reservaId: string,
    public readonly pagoId: string | null,
    public readonly estado: boolean,
    public readonly observacion: string | null,
    public readonly cerradoEn: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isAbierto(): boolean {
    return this.estado === true;
  }

  isCerrado(): boolean {
    return this.estado === false;
  }

  hasPago(): boolean {
    return this.pagoId !== null;
  }
}
