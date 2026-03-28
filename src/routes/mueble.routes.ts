import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { MuebleController } from "../presentation/controllers/mueble.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { adminMiddleware } from "../presentation/middlewares/admin.middleware";
import { validSchema, validParams } from "../presentation/middlewares/valid.middleware";
import { CreateMuebleSchema, UpdateMuebleSchema, UUIDParamSchema } from "../presentation/schemas/mueble.schema";

export function createMuebleRoutes(): AppHono {
  const controller = container.resolve(MuebleController);

  const router = new Hono<{ Variables: AppVariables }>();

  router.use("*", authMiddleware);

  router.get("/", adminMiddleware, controller.list.bind(controller));
  router.get("/:id", adminMiddleware, validParams(UUIDParamSchema), controller.findById.bind(controller));

  router.post("/", adminMiddleware, validSchema(CreateMuebleSchema), controller.create.bind(controller));
  router.put(
    "/:id",
    adminMiddleware,
    validParams(UUIDParamSchema),
    validSchema(UpdateMuebleSchema),
    controller.update.bind(controller),
  );
  router.delete("/:id", adminMiddleware, validParams(UUIDParamSchema), controller.delete.bind(controller));

  return router;
}
