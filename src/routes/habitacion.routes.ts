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
  const ctrl = container.resolve(HabitacionController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.post("/", authMiddleware, parseFormDataMiddleware, validSchema(CreateHabitacionSchema), (c) => ctrl.create(c));
  router.get("/", authMiddleware, (c) => ctrl.list(c));
  router.get("/:id", authMiddleware, validParams(UUIDParamSchema), (c) => ctrl.findById(c));
  router.put(
    "/:id",
    authMiddleware,
    validParams(UUIDParamSchema),
    parseFormDataMiddleware,
    validSchema(UpdateHabitacionSchema),
    (c) => ctrl.update(c),
  );
  router.patch(
    "/:id/estado",
    authMiddleware,
    validParams(UUIDParamSchema),
    validSchema(UpdateHabitacionStatusSchema),
    (c) => ctrl.updateStatus(c),
  );
  router.delete("/:id", authMiddleware, validParams(UUIDParamSchema), (c) => ctrl.delete(c));

  router.get("/disponibles", validQuery(SearchAvailableHabitacionesSchema), (c) => ctrl.searchAvailable(c));
  router.get("/disponibles/:id", validParams(UUIDParamSchema), (c) => ctrl.findByIdWithPrice(c));

  return router;
}
