import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { PromocionController } from "../presentation/controllers/promocion.controller";
import { validSchema, validParams, validQuery } from "../presentation/middlewares/valid.middleware";
import {
  CreatePromocionSchema,
  UpdatePromocionSchema,
  UUIDParamSchema,
} from "../presentation/schemas/promocion.schema";
import { PaginationQuerySchema } from "../presentation/schemas/pagination.schema";

export function createPromocionRoutes(): AppHono {
  const ctrl = container.resolve(PromocionController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.get("/", validQuery(PaginationQuerySchema), (c) => ctrl.list(c));
  router.get("/:id", validParams(UUIDParamSchema), (c) => ctrl.findById(c));
  router.post("/", validSchema(CreatePromocionSchema), (c) => ctrl.create(c));
  router.put("/:id", validParams(UUIDParamSchema), validSchema(UpdatePromocionSchema), (c) => ctrl.update(c));
  router.delete("/:id", validParams(UUIDParamSchema), (c) => ctrl.delete(c));

  return router;
}
