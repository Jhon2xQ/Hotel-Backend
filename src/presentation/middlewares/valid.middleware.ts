import { Next } from "hono";
import { ZodSchema } from "zod";
import { AppContext } from "../../common/types/app.types";
import { ApiResponse } from "../api.response";

export function validSchema(schema: ZodSchema) {
  return async (c: AppContext, next: Next) => {
    try {
      const body = await c.req.json();
      const validData = schema.parse(body);
      c.set("validData", validData);
      await next();
    } catch (error: any) {
      const errors = error.errors?.map((e: any) => `${e.path.join(".")}: ${e.message}`).join(", ");
      return c.json(ApiResponse.error(errors || "Datos inválidos"), 400);
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
      const errors = error.errors?.map((e: any) => `${e.path.join(".")}: ${e.message}`).join(", ");
      return c.json(ApiResponse.error(errors || "Parámetros inválidos"), 400);
    }
  };
}
