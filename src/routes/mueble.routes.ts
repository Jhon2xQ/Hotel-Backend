import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { MuebleController } from "../presentation/controllers/mueble.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { adminMiddleware } from "../presentation/middlewares/admin.middleware";
import { validSchema, validParams } from "../presentation/middlewares/valid.middleware";
import { CreateMuebleSchema, UpdateMuebleSchema, UUIDParamSchema } from "../presentation/schemas/mueble.schema";

export function createMuebleRoutes(): AppHono {
  const ctrl = container.resolve(MuebleController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.use("*", authMiddleware);
  router.get("/", adminMiddleware, (c) => ctrl.list(c));
  router.get("/:id", adminMiddleware, validParams(UUIDParamSchema), (c) => ctrl.findById(c));
  router.post("/", adminMiddleware, validSchema(CreateMuebleSchema), (c) => ctrl.create(c));
  router.put(
    "/:id",
    adminMiddleware,
    validParams(UUIDParamSchema),
    validSchema(UpdateMuebleSchema),
    (c) => ctrl.update(c),
  );
  router.delete("/:id", adminMiddleware, validParams(UUIDParamSchema), (c) => ctrl.delete(c));

  return router;
}
