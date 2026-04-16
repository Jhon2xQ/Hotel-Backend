export enum UnidadInsumo {
  Unidad = "UNIDAD",
  Litro = "LITRO",
  Kg = "KG",
  Gr = "GR",
  Botella = "BOTELLA",
  Caja = "CAJA",
  Fco = "FCO",
  Saco = "SACO",
  Tubo = "TUBO",
  Blister = "BLISTER",
  Paquete = "PAQUETE",
}

export enum TipoMovimiento {
  Entrada = "ENTRADA",
  Salida = "SALIDA",
}

export enum MotivoEntrada {
  Compra = "COMPRA",
  Donacion = "DONACION",
  Ajuste = "AJUSTE",
  Reposicion = "REPOSICION",
}

export enum MotivoSalida {
  Consumo = "CONSUMO",
  Deshecho = "DESECHO",
  Ajuste = "AJUSTE",
  StockMinimo = "STOCK_MINIMO",
}

export class InsumoBar {
  constructor(
    public readonly id: string,
    public readonly codigo: string,
    public readonly nombre: string,
    public readonly unidad: UnidadInsumo,
    public readonly stockActual: number,
    public readonly stockMinimo: number,
    public readonly activo: boolean,
    public readonly notas: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}

export class MovimientoBar {
  constructor(
    public readonly id: string,
    public readonly insumoId: string,
    public readonly tipo: TipoMovimiento,
    public readonly cantidad: number,
    public readonly motivoEntrada: MotivoEntrada | null,
    public readonly motivoSalida: MotivoSalida | null,
    public readonly notas: string | null,
    public readonly createdAt: Date,
  ) {}
}