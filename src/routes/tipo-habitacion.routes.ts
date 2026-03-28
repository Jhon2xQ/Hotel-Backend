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
  const controller = container.resolve(TipoHabitacionController);

  const router = new Hono<{ Variables: AppVariables }>();

  router.post("/", authMiddleware, validSchema(CreateTipoHabitacionSchema), controller.create.bind(controller));
  router.get("/", controller.list.bind(controller));
  router.get("/:id", authMiddleware, validParams(UUIDParamSchema), controller.findById.bind(controller));
  router.put(
    "/:id",
    authMiddleware,
    validParams(UUIDParamSchema),
    validSchema(UpdateTipoHabitacionSchema),
    controller.update.bind(controller),
  );
  router.delete("/:id", authMiddleware, validParams(UUIDParamSchema), controller.delete.bind(controller));

  return router;
}
