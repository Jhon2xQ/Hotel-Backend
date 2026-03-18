import { Context, ErrorHandler } from "hono";
import { DomainException } from "../../domain/exceptions/domain.exception";
import { Prisma } from "../../../generated/prisma/client";
import { ApiResponse } from "../api.response";

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
    console.error(`[PrismaError] ${err.name}: ${shortMessage}`);
    return c.json(ApiResponse.error("Error en la base de datos"), 500);
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    const shortMessage = err.message
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)[0];
    console.error(`[PrismaError] ${err.name}: ${shortMessage}`);
    return c.json(ApiResponse.error("Error de validación en la base de datos"), 500);
  }

  console.error(`[Unhandled Error] ${err.name}: ${err.message}`);
  return c.json(ApiResponse.error("Error interno del servidor"), 500);
};
