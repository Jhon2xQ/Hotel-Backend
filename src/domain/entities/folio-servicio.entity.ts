export class FolioServicio {
  constructor(
    public readonly id: string,
    public readonly folioId: string,
    public readonly concepto: string,
    public readonly cantidad: number,
    public readonly precioUnit: number,
    public readonly total: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
