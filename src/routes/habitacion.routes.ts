import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { HabitacionController } from "../presentation/controllers/habitacion.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { validSchema, validParams, validQuery } from "../presentation/middlewares/valid.middleware";
import { parseFormDataMiddleware } from "../presentation/middlewares/parse-form-data.middleware";
import {
  CreateHabitacionSchema,
  UpdateHabitacionSchema,
  UpdateHabitacionStatusSchema,
  SearchAvailableHabitacionesSchema,
} from "../presentation/schemas/habitacion.schema";
import { UUIDParamSchema } from "../presentation/schemas/tipo-habitacion.schema";

export function createHabitacionRoutes(): AppHono {
  const controller = container.resolve(HabitacionController);

  const router = new Hono<{ Variables: AppVariables }>();

  router.post("/", authMiddleware, parseFormDataMiddleware, validSchema(CreateHabitacionSchema), controller.create.bind(controller));
  router.get("/", authMiddleware, controller.list.bind(controller));
  router.get("/:id", authMiddleware, validParams(UUIDParamSchema), controller.findById.bind(controller));
  router.put(
    "/:id",
    authMiddleware,
    validParams(UUIDParamSchema),
    parseFormDataMiddleware,
    validSchema(UpdateHabitacionSchema),
    controller.update.bind(controller),
  );
  router.patch("/:id/estado", authMiddleware, validParams(UUIDParamSchema), validSchema(UpdateHabitacionStatusSchema), controller.updateStatus.bind(controller));
  router.delete("/:id", authMiddleware, validParams(UUIDParamSchema), controller.delete.bind(controller));

  router.get("/disponibles", validQuery(SearchAvailableHabitacionesSchema), controller.searchAvailable.bind(controller));
  router.get("/disponibles/:id", validParams(UUIDParamSchema), controller.findByIdWithPrice.bind(controller));

  return router;
}
