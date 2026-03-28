import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { CanalController } from "../presentation/controllers/canal.controller";
import { validSchema, validParams } from "../presentation/middlewares/valid.middleware";
import { CreateCanalSchema, UpdateCanalSchema, UUIDParamSchema } from "../presentation/schemas/canal.schema";

export function createCanalRoutes(): AppHono {
  const ctrl = container.resolve(CanalController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.get("/", (c) => ctrl.list(c));
  router.get("/:id", validParams(UUIDParamSchema), (c) => ctrl.findById(c));
  router.post("/", validSchema(CreateCanalSchema), (c) => ctrl.create(c));
  router.put("/:id", validParams(UUIDParamSchema), validSchema(UpdateCanalSchema), (c) => ctrl.update(c));
  router.delete("/:id", validParams(UUIDParamSchema), (c) => ctrl.delete(c));

  return router;
}
