import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { TipoHabitacionController } from "../presentation/controllers/tipo-habitacion.controller";
import { validSchema, validParams } from "../presentation/middlewares/valid.middleware";
import { CreateTipoHabitacionSchema, UpdateTipoHabitacionSchema, UUIDParamSchema } from "../presentation/schemas/tipo-habitacion.schema";

export function createTipoHabitacionRoutes(): AppHono {
  const ctrl = container.resolve(TipoHabitacionController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.get("/", (c) => ctrl.list(c));
  router.get("/:id", validParams(UUIDParamSchema), (c) => ctrl.findById(c));
  router.post("/", validSchema(CreateTipoHabitacionSchema), (c) => ctrl.create(c));
  router.put("/:id", validParams(UUIDParamSchema), validSchema(UpdateTipoHabitacionSchema), (c) => ctrl.update(c));
  router.delete("/:id", validParams(UUIDParamSchema), (c) => ctrl.delete(c));

  return router;
}

export function createTipoHabitacionPublicRoutes(): AppHono {
  const ctrl = container.resolve(TipoHabitacionController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.get("/", (c) => ctrl.list(c));
  router.get("/:id", validParams(UUIDParamSchema), (c) => ctrl.findById(c));

  return router;
}
