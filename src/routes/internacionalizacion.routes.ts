import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { InternacionalizacionController } from "../presentation/controllers/internacionalizacion.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { validSchema } from "../presentation/middlewares/valid.middleware";
import { requireRoles } from "../presentation/middlewares/roles.middleware";
import { ROLES } from "../common/constants/roles";
import { CreateInternacionalizacionSchema, UpdateInternacionalizacionSchema } from "../presentation/schemas/internacionalizacion.schema";

export function createInternacionalizacionRoutes(): AppHono {
  const controller = container.resolve(InternacionalizacionController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.use("*", authMiddleware);

  router.get(
    "/:habitacionId",
    controller.findByHabitacion.bind(controller),
  );

  router.post(
    "/:habitacionId",
    requireRoles(ROLES.ADMIN),
    validSchema(CreateInternacionalizacionSchema),
    controller.create.bind(controller),
  );

  router.put(
    "/:habitacionId",
    requireRoles(ROLES.ADMIN),
    validSchema(UpdateInternacionalizacionSchema),
    controller.update.bind(controller),
  );

  router.delete(
    "/:habitacionId",
    requireRoles(ROLES.ADMIN),
    controller.delete.bind(controller),
  );

  return router;
}