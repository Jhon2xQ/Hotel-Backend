import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { TarifaController } from "../presentation/controllers/tarifa.controller";
import { validSchema, validParams } from "../presentation/middlewares/valid.middleware";
import { CreateTarifaSchema, UpdateTarifaSchema, UUIDParamSchema } from "../presentation/schemas/tarifa.schema";

export function createTarifaRoutes(): AppHono {
  const ctrl = container.resolve(TarifaController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.get("/", (c) => ctrl.list(c));
  router.get("/:id", validParams(UUIDParamSchema), (c) => ctrl.findById(c));
  router.post("/", validSchema(CreateTarifaSchema), (c) => ctrl.create(c));
  router.put("/:id", validParams(UUIDParamSchema), validSchema(UpdateTarifaSchema), (c) => ctrl.update(c));
  router.delete("/:id", validParams(UUIDParamSchema), (c) => ctrl.delete(c));

  return router;
}
