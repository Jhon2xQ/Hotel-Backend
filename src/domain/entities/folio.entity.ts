export class Folio {
  constructor(
    public readonly id: string,
    public readonly nroFolio: number,
    public readonly reservaId: string,
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
}