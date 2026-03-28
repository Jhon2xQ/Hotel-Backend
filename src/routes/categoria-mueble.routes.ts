import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { CategoriaMuebleController } from "../presentation/controllers/categoria-mueble.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { validParams, validSchema } from "../presentation/middlewares/valid.middleware";
import {
  CategoriaMuebleIdSchema,
  CreateCategoriaMuebleSchema,
  UpdateCategoriaMuebleSchema,
} from "../presentation/schemas/categoria-mueble.schema";
import { adminMiddleware } from "../presentation/middlewares/admin.middleware";

export function categoriaMuebleRoutes(): AppHono {
  const controller = container.resolve(CategoriaMuebleController);

  const router = new Hono<{ Variables: AppVariables }>();

  router.use("*", authMiddleware);

  router.get("/", adminMiddleware, controller.list.bind(controller));
  router.get("/:id", adminMiddleware, validParams(CategoriaMuebleIdSchema), controller.findById.bind(controller));
  router.post("/", adminMiddleware, validSchema(CreateCategoriaMuebleSchema), controller.create.bind(controller));
  router.put(
    "/:id",
    adminMiddleware,
    validParams(CategoriaMuebleIdSchema),
    validSchema(UpdateCategoriaMuebleSchema),
    controller.update.bind(controller),
  );
  router.delete("/:id", adminMiddleware, validParams(CategoriaMuebleIdSchema), controller.delete.bind(controller));

  return router;
}
