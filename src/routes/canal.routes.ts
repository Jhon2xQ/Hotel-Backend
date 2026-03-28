import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { CanalController } from "../presentation/controllers/canal.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { adminMiddleware } from "../presentation/middlewares/admin.middleware";
import { validSchema, validParams } from "../presentation/middlewares/valid.middleware";
import { CreateCanalSchema, UpdateCanalSchema, UUIDParamSchema } from "../presentation/schemas/canal.schema";

export function createCanalRoutes(): AppHono {
  const ctrl = container.resolve(CanalController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.use("*", authMiddleware);
  router.post("/", adminMiddleware, validSchema(CreateCanalSchema), (c) => ctrl.create(c));
  router.get("/", (c) => ctrl.list(c));
  router.get("/:id", validParams(UUIDParamSchema), (c) => ctrl.findById(c));
  router.put(
    "/:id",
    adminMiddleware,
    validParams(UUIDParamSchema),
    validSchema(UpdateCanalSchema),
    (c) => ctrl.update(c),
  );
  router.delete("/:id", adminMiddleware, validParams(UUIDParamSchema), (c) => ctrl.delete(c));

  return router;
}
