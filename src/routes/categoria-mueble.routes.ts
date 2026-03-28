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
  const ctrl = container.resolve(CategoriaMuebleController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.use("*", authMiddleware);
  router.get("/", adminMiddleware, (c) => ctrl.list(c));
  router.get("/:id", adminMiddleware, validParams(CategoriaMuebleIdSchema), (c) => ctrl.findById(c));
  router.post("/", adminMiddleware, validSchema(CreateCategoriaMuebleSchema), (c) => ctrl.create(c));
  router.put(
    "/:id",
    adminMiddleware,
    validParams(CategoriaMuebleIdSchema),
    validSchema(UpdateCategoriaMuebleSchema),
    (c) => ctrl.update(c),
  );
  router.delete("/:id", adminMiddleware, validParams(CategoriaMuebleIdSchema), (c) => ctrl.delete(c));

  return router;
}
