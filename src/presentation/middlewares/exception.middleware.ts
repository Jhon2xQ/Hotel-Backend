import { Context, Next } from "hono";
import { DomainException } from "../../domain/exceptions/domain.exception";
import { Prisma } from "../../../generated/prisma/client";
import { ApiResponse } from "../api.response";

export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    console.error("Error:", error);

    if (error instanceof DomainException) {
      return c.json(ApiResponse.error(error.message), error.statusCode as any);
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return c.json(ApiResponse.error("Error en la base de datos"), 500);
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return c.json(ApiResponse.error("Error de validación en la base de datos"), 500);
    }

    return c.json(ApiResponse.error("Error interno del servidor"), 500);
  }
}
