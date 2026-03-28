import { Context, ErrorHandler } from "hono";
import { DomainException } from "../../domain/exceptions/domain.exception";
import { Prisma } from "../../../generated/prisma/client";
import { ApiResponse } from "../api.response";

function mapPrismaKnownRequest(
  err: Prisma.PrismaClientKnownRequestError,
): { message: string; status: number } {
  const target = err.meta?.target;
  const targetStr = Array.isArray(target)
    ? target.join(", ")
    : typeof target === "string"
      ? target
      : null;

  switch (err.code) {
    case "P2002":
      return {
        message: targetStr
          ? `Ya existe un registro con el mismo valor único (${targetStr}).`
          : "Ya existe un registro con el mismo valor único.",
        status: 409,
      };
    case "P2025":
      return {
        message: "El registro no existe o ya fue eliminado.",
        status: 404,
      };
    case "P2003":
      return {
        message: "Referencia inválida: falta un registro relacionado requerido.",
        status: 400,
      };
    case "P2014":
      return {
        message: "La operación no se puede completar por una restricción entre registros relacionados.",
        status: 409,
      };
    case "P2016":
      return {
        message: "No se pudo interpretar la consulta sobre la base de datos.",
        status: 400,
      };
    default:
      return {
        message: "No se pudo completar la operación en la base de datos.",
        status: 500,
      };
  }
}

export const errorHandler: ErrorHandler = (err: Error, c: Context) => {
  if (err instanceof DomainException) {
    console.error(`[${err.name}] ${err.statusCode}: ${err.message}`);
    return c.json(ApiResponse.error(err.message), err.statusCode as any);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const shortMessage = err.message
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)[0];
    const { message, status } = mapPrismaKnownRequest(err);
    console.error(`[PrismaError] ${err.code} ${err.name}: ${shortMessage}`, err.meta);
    return c.json(ApiResponse.error(message), status as any);
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    const shortMessage = err.message
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)[0];
    console.error(`[PrismaError] ${err.name}: ${shortMessage}`);
    return c.json(ApiResponse.error("Los datos enviados no coinciden con el esquema de la base de datos."), 400);
  }

  console.error(`[Unhandled Error] ${err.name}: ${err.message}`);
  return c.json(ApiResponse.error("Error interno del servidor"), 500);
};
