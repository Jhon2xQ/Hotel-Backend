import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { CategoriaMuebleController } from "../presentation/controllers/categoria-mueble.controller";
import { validSchema, validParams } from "../presentation/middlewares/valid.middleware";
import { CategoriaMuebleIdSchema, CreateCategoriaMuebleSchema, UpdateCategoriaMuebleSchema } from "../presentation/schemas/categoria-mueble.schema";

export function createCategoriaMuebleRoutes(): AppHono {
  const ctrl = container.resolve(CategoriaMuebleController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.get("/", (c) => ctrl.list(c));
  router.get("/:id", validParams(CategoriaMuebleIdSchema), (c) => ctrl.findById(c));
  router.post("/", validSchema(CreateCategoriaMuebleSchema), (c) => ctrl.create(c));
  router.put("/:id", validParams(CategoriaMuebleIdSchema), validSchema(UpdateCategoriaMuebleSchema), (c) => ctrl.update(c));
  router.delete("/:id", validParams(CategoriaMuebleIdSchema), (c) => ctrl.delete(c));

  return router;
}
