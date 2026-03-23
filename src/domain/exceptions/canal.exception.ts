import { DomainException } from "./domain.exception";

export class CanalException extends DomainException {
  static notFoundById(): CanalException {
    return new CanalException("Canal no encontrado", 404);
  }

  static hasRelatedRecords(): CanalException {
    return new CanalException("No se puede eliminar el canal porque tiene registros relacionados", 409);
  }

  static duplicateNombre(nombre: string): CanalException {
    return new CanalException(`Ya existe un canal con el nombre '${nombre}'`, 409);
  }
}
