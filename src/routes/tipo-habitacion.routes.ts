import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { TipoHabitacionController } from "../presentation/controllers/tipo-habitacion.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { validSchema, validParams } from "../presentation/middlewares/valid.middleware";
import {
  CreateTipoHabitacionSchema,
  UpdateTipoHabitacionSchema,
  UUIDParamSchema,
} from "../presentation/schemas/tipo-habitacion.schema";

export function createTipoHabitacionRoutes(): AppHono {
  const ctrl = container.resolve(TipoHabitacionController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.post("/", authMiddleware, validSchema(CreateTipoHabitacionSchema), (c) => ctrl.create(c));
  router.get("/", (c) => ctrl.list(c));
  router.get("/:id", authMiddleware, validParams(UUIDParamSchema), (c) => ctrl.findById(c));
  router.put(
    "/:id",
    authMiddleware,
    validParams(UUIDParamSchema),
    validSchema(UpdateTipoHabitacionSchema),
    (c) => ctrl.update(c),
  );
  router.delete("/:id", authMiddleware, validParams(UUIDParamSchema), (c) => ctrl.delete(c));

  return router;
}
