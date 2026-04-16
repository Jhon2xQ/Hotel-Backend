import { InsumoCocina, MovimientoCocina, UnidadInsumo, TipoMovimiento, MotivoEntrada, MotivoSalida } from "../../src/domain/entities/insumo-cocina.entity";

export function createMockInsumoCocina(overrides?: Partial<InsumoCocina>): InsumoCocina {
  return new InsumoCocina(
    overrides?.id ?? "test-insumo-cocina-id",
    overrides?.codigo ?? "COC-001",
    overrides?.nombre ?? "Carne de Res",
    overrides?.unidad ?? UnidadInsumo.Kg,
    overrides?.stockActual ?? 20,
    overrides?.stockMinimo ?? 5,
    overrides?.activo ?? true,
    overrides?.notas ?? null,
    overrides?.createdAt ?? new Date(),
    overrides?.updatedAt ?? new Date(),
  );
}

export function createMockMovimientoCocina(overrides?: Partial<MovimientoCocina>): MovimientoCocina {
  return new MovimientoCocina(
    overrides?.id ?? "test-movimiento-cocina-id",
    overrides?.insumoId ?? "test-insumo-cocina-id",
    overrides?.tipo ?? TipoMovimiento.Entrada,
    overrides?.cantidad ?? 10,
    overrides?.motivoEntrada ?? MotivoEntrada.Compra,
    overrides?.motivoSalida ?? null,
    overrides?.notas ?? null,
    overrides?.createdAt ?? new Date(),
  );
}