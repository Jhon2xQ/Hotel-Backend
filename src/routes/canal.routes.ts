import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { CanalController } from "../presentation/controllers/canal.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { adminMiddleware } from "../presentation/middlewares/admin.middleware";
import { validSchema, validParams } from "../presentation/middlewares/valid.middleware";
import { CreateCanalSchema, UpdateCanalSchema, UUIDParamSchema } from "../presentation/schemas/canal.schema";

export function createCanalRoutes(): AppHono {
  const controller = container.resolve(CanalController);

  const router = new Hono<{ Variables: AppVariables }>();

  router.use("*", authMiddleware);

  router.post("/", adminMiddleware, validSchema(CreateCanalSchema), controller.create.bind(controller));
  router.get("/", controller.list.bind(controller));
  router.get("/:id", validParams(UUIDParamSchema), controller.findById.bind(controller));
  router.put(
    "/:id",
    adminMiddleware,
    validParams(UUIDParamSchema),
    validSchema(UpdateCanalSchema),
    controller.update.bind(controller),
  );
  router.delete("/:id", adminMiddleware, validParams(UUIDParamSchema), controller.delete.bind(controller));

  return router;
}
