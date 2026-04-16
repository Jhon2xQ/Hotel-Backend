import { Producto } from "../entities/producto.entity";
import type { PaginationParams, PaginatedResult } from "../../application/paginations/api.pagination";

export interface CreateProductoParams {
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  precioUnitario: number;
  stock?: number;
}

export interface UpdateProductoParams {
  codigo?: string;
  nombre?: string;
  descripcion?: string | null;
  precioUnitario?: number;
  stock?: number;
}

export interface IProductoRepository {
  create(data: CreateProductoParams): Promise<Producto>;
  findAll(): Promise<Producto[]>;
  findById(id: string): Promise<Producto | null>;
  findByCodigo(codigo: string): Promise<Producto | null>;
  findAllPaginated(params: PaginationParams): Promise<PaginatedResult<Producto>>;
  update(id: string, data: UpdateProductoParams): Promise<Producto>;
  delete(id: string): Promise<void>;
}