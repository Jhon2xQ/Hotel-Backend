import { InsumoBar, MovimientoBar, UnidadInsumo, TipoMovimiento, MotivoEntrada, MotivoSalida } from "../../src/domain/entities/insumo-bar.entity";

export function createMockInsumoBar(overrides?: Partial<InsumoBar>): InsumoBar {
  return new InsumoBar(
    overrides?.id ?? "test-insumo-bar-id",
    overrides?.codigo ?? "BAR-001",
    overrides?.nombre ?? "Cerveza Cristal",
    overrides?.unidad ?? UnidadInsumo.Botella,
    overrides?.stockActual ?? 50,
    overrides?.stockMinimo ?? 10,
    overrides?.activo ?? true,
    overrides?.notas ?? null,
    overrides?.createdAt ?? new Date(),
    overrides?.updatedAt ?? new Date(),
  );
}

export function createMockMovimientoBar(overrides?: Partial<MovimientoBar>): MovimientoBar {
  return new MovimientoBar(
    overrides?.id ?? "test-movimiento-bar-id",
    overrides?.insumoId ?? "test-insumo-bar-id",
    overrides?.tipo ?? TipoMovimiento.Entrada,
    overrides?.cantidad ?? 10,
    overrides?.motivoEntrada ?? MotivoEntrada.Compra,
    overrides?.motivoSalida ?? null,
    overrides?.notas ?? null,
    overrides?.createdAt ?? new Date(),
  );
}