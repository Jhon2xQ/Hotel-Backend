import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { ProductoController } from "../presentation/controllers/producto.controller";
import { validSchema, validParams, validQuery } from "../presentation/middlewares/valid.middleware";
import { CreateProductoSchema, UpdateProductoSchema, UUIDParamSchema } from "../presentation/schemas/producto.schema";
import { PaginationQuerySchema } from "../presentation/schemas/pagination.schema";

export function createProductoRoutes(): AppHono {
  const ctrl = container.resolve(ProductoController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.get("/", validQuery(PaginationQuerySchema), (c) => ctrl.list(c));
  router.get("/:id", validParams(UUIDParamSchema), (c) => ctrl.findById(c));
  router.post("/", validSchema(CreateProductoSchema), (c) => ctrl.create(c));
  router.put("/:id", validParams(UUIDParamSchema), validSchema(UpdateProductoSchema), (c) => ctrl.update(c));
  router.delete("/:id", validParams(UUIDParamSchema), (c) => ctrl.delete(c));

  return router;
}