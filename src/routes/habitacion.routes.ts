import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { HabitacionController } from "../presentation/controllers/habitacion.controller";
import { validSchema, validParams, validQuery } from "../presentation/middlewares/valid.middleware";
import { parseFormDataMiddleware } from "../presentation/middlewares/parse-form-data.middleware";
import { UUIDParamSchema } from "../presentation/schemas/tipo-habitacion.schema";
import {
  CreateHabitacionSchema,
  UpdateHabitacionSchema,
  UpdateHabitacionStatusSchema,
  SearchAvailableHabitacionesSchema,
  ListHabitacionQuerySchema,
  HabitacionDetailQuerySchema,
  HabitacionPublicDetailQuerySchema,
} from "../presentation/schemas/habitacion.schema";

export function createHabitacionRoutes(): AppHono {
  const ctrl = container.resolve(HabitacionController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.get("/", validQuery(ListHabitacionQuerySchema), (c) => ctrl.listPaginated(c));
  router.get("/:id", validParams(UUIDParamSchema), validQuery(HabitacionDetailQuerySchema), (c) => ctrl.findById(c));
  router.post("/", parseFormDataMiddleware, validSchema(CreateHabitacionSchema), (c) => ctrl.create(c));
  router.put("/:id", validParams(UUIDParamSchema), parseFormDataMiddleware, validSchema(UpdateHabitacionSchema), (c) => ctrl.update(c));
  router.patch("/:id/estado", validParams(UUIDParamSchema), validSchema(UpdateHabitacionStatusSchema), (c) => ctrl.updateStatus(c));
  router.delete("/:id", validParams(UUIDParamSchema), (c) => ctrl.delete(c));

  return router;
}

export function createHabitacionPublicRoutes(): AppHono {
  const ctrl = container.resolve(HabitacionController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.get("/", validQuery(SearchAvailableHabitacionesSchema), (c) => ctrl.searchAvailable(c));
  router.get("/:id", validParams(UUIDParamSchema), validQuery(HabitacionPublicDetailQuerySchema), (c) => ctrl.findByIdWithPrice(c));

  return router;
}
