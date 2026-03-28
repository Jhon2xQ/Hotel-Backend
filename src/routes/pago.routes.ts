import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { PagoController } from "../presentation/controllers/pago.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { adminMiddleware } from "../presentation/middlewares/admin.middleware";
import { validSchema, validParams } from "../presentation/middlewares/valid.middleware";
import { CreatePagoSchema, UpdatePagoSchema } from "../presentation/schemas/pago.schema";
import { UUIDParamSchema } from "../presentation/schemas/tipo-habitacion.schema";

export function createPagoRoutes(): AppHono {
  const controller = container.resolve(PagoController);

  const router = new Hono<{ Variables: AppVariables }>();

  router.use("*", authMiddleware);

  router.post("/", adminMiddleware, validSchema(CreatePagoSchema), controller.create.bind(controller));
  router.get("/", controller.list.bind(controller));
  router.get("/:id", validParams(UUIDParamSchema), controller.findById.bind(controller));
  router.put(
    "/:id",
    adminMiddleware,
    validParams(UUIDParamSchema),
    validSchema(UpdatePagoSchema),
    controller.update.bind(controller),
  );
  router.delete("/:id", adminMiddleware, validParams(UUIDParamSchema), controller.delete.bind(controller));

  return router;
}
