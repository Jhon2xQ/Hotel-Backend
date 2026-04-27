export class Internacionalizacion {
  constructor(
    public readonly id: string,
    public readonly habitacionId: string,
    public readonly descripcionEn: string | null,
    public readonly descripcionFr: string | null,
    public readonly featureEn: string | null,
    public readonly featureFr: string | null,
    public readonly amenitiesEn: string | null,
    public readonly amenitiesFr: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}