import { IMuebleRepository } from "../../../domain/interfaces/mueble.repository.interface";
import { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import { MuebleException } from "../../../domain/exceptions/mueble.exception";
import { CreateMuebleInput, MuebleOutput } from "../../dtos/mueble.dto";
import { CategoriaMuebleRepository } from "../../../infrastructure/repositories/categoria-mueble.repository";
import { CategoriaMuebleException } from "../../../domain/exceptions/categoria-mueble.exception";

export class CreateMuebleUseCase {
  constructor(
    private repository: IMuebleRepository,
    private habitacionRepository: IHabitacionRepository,
    private categoriaRepository: CategoriaMuebleRepository
  ) {}

  async execute(input: CreateMuebleInput): Promise<MuebleOutput> {
    const existing = await this.repository.findByCodigo(input.codigo);
    if (existing) {
      throw MuebleException.duplicateCodigo();
    }
    if (input.categoria_id) {
      const categoria = await this.categoriaRepository.findById(input.categoria_id);
      if (!categoria) {
        throw CategoriaMuebleException.notFoundById(input.categoria_id);
      }
    }

    if (input.habitacion_id) {
      const habitacion = await this.habitacionRepository.findById(input.habitacion_id);
      if (!habitacion) {
        throw MuebleException.habitacionNotFound();
      }
    }

    const furniture = await this.repository.create({
      codigo: input.codigo,
      nombre: input.nombre,
      descripcion: input.descripcion ?? null,
      categoriaId: input.categoria_id,
      imagenUrl: input.imagen_url ?? null,
      condicion: input.condicion,
      fechaAdq: input.fecha_adquisicion ? new Date(input.fecha_adquisicion) : null,
      ultimaRevision: input.ultima_revision ? new Date(input.ultima_revision) : null,
      habitacionId: input.habitacion_id,
    });
    return furniture.toOutput();
  }
}
