import type { Producto } from "../../domain/entities/producto.entity";

export interface CreateProductoDto {
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio_unitario: number;
  stock?: number;
}

export interface UpdateProductoDto {
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  precio_unitario?: number;
  stock?: number;
}

export interface ProductoDto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  precio_unitario: number;
  stock: number;
  created_at: string;
  updated_at: string;
}

export function toProductoDto(p: Producto): ProductoDto {
  return {
    id: p.id,
    codigo: p.codigo,
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio_unitario: p.precioUnitario,
    stock: p.stock,
    created_at: p.createdAt.toISOString(),
    updated_at: p.updatedAt.toISOString(),
  };
}