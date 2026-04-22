import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { MuebleController } from "../presentation/controllers/mueble.controller";
import { validSchema, validParams, validQuery } from "../presentation/middlewares/valid.middleware";
import { CreateMuebleSchema, UpdateMuebleSchema, UUIDParamSchema, ListMuebleQuerySchema } from "../presentation/schemas/mueble.schema";
import { parseFormDataMiddleware } from "../presentation/middlewares/parse-form-data.middleware";

export function createMuebleRoutes(): AppHono {
  const ctrl = container.resolve(MuebleController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.get("/", validQuery(ListMuebleQuerySchema), (c) => ctrl.listPaginated(c));
  router.get("/all", (c) => ctrl.list(c));
  router.get("/:id", validParams(UUIDParamSchema), (c) => ctrl.findById(c));
  router.post("/", parseFormDataMiddleware, validSchema(CreateMuebleSchema), (c) => ctrl.create(c));
  router.put("/:id", validParams(UUIDParamSchema), parseFormDataMiddleware, validSchema(UpdateMuebleSchema), (c) => ctrl.update(c));
  router.delete("/:id", validParams(UUIDParamSchema), (c) => ctrl.delete(c));

  return router;
}
