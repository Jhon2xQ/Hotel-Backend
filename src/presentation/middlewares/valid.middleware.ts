import { Next } from "hono";
import { ZodError, ZodSchema } from "zod";
import { AppContext } from "../../common/types/app.types";
import { ApiResponse } from "../api.response";

export function validSchema(schema: ZodSchema) {
  return async (c: AppContext, next: Next) => {
    try {
      // Check if we have parsed form data from middleware
      const rawFormData = c.get("rawFormData");
      const body = rawFormData || (await c.req.json());
      const validData = schema.parse(body);
      c.set("validData", validData);
      await next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errorDetails = error.issues.map((err) => {
          const field = err.path.join(".");
          return field;
        });
        return c.json(ApiResponse.error(`Error de validacion en cuerpo: ${errorDetails.join(" | ")}`), 400);
      }
      return c.json(ApiResponse.error("Datos inválidos en cuerpo de request"), 400);
    }
  };
}

export function validParams(schema: ZodSchema) {
  return async (c: AppContext, next: Next) => {
    try {
      const params = c.req.param();
      schema.parse(params);
      await next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errorDetails = error.issues.map((err) => {
          const field = err.path.join(".");
          return field;
        });
        return c.json(ApiResponse.error(`Error de validacion en parametro: ${errorDetails.join(" | ")}`), 400);
      }
      return c.json(ApiResponse.error("Datos inválidos en parametros de request"), 400);
    }
  };
}

export function validQuery(schema: ZodSchema) {
  return async (c: AppContext, next: Next) => {
    try {
      const query = c.req.query();
      const validData = schema.parse(query);
      c.set("validData", validData);
      await next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errorDetails = error.issues.map((err) => {
          const field = err.path.join(".");
          return `${field}: ${err.message}`;
        });
        return c.json(ApiResponse.error(`Error de validación en query: ${errorDetails.join(" | ")}`), 400);
      }
      return c.json(ApiResponse.error("Datos inválidos en query params"), 400);
    }
  };
}
