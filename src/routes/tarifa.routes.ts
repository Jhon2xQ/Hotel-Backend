import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { TarifaController } from "../presentation/controllers/tarifa.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { adminMiddleware } from "../presentation/middlewares/admin.middleware";
import { validSchema, validParams } from "../presentation/middlewares/valid.middleware";
import { CreateTarifaSchema, UpdateTarifaSchema, UUIDParamSchema } from "../presentation/schemas/tarifa.schema";

export function createTarifaRoutes(): AppHono {
  const controller = container.resolve(TarifaController);

  const router = new Hono<{ Variables: AppVariables }>();

  router.use("*", authMiddleware);

  router.post("/", adminMiddleware, validSchema(CreateTarifaSchema), controller.create.bind(controller));
  router.get("/", controller.list.bind(controller));
  router.get("/:id", validParams(UUIDParamSchema), controller.findById.bind(controller));
  router.put(
    "/:id",
    adminMiddleware,
    validParams(UUIDParamSchema),
    validSchema(UpdateTarifaSchema),
    controller.update.bind(controller),
  );
  router.delete("/:id", adminMiddleware, validParams(UUIDParamSchema), controller.delete.bind(controller));

  return router;
}
