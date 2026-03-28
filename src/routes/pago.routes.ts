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
  const ctrl = container.resolve(PagoController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.use("*", authMiddleware);
  router.post("/", adminMiddleware, validSchema(CreatePagoSchema), (c) => ctrl.create(c));
  router.get("/", (c) => ctrl.list(c));
  router.get("/:id", validParams(UUIDParamSchema), (c) => ctrl.findById(c));
  router.put(
    "/:id",
    adminMiddleware,
    validParams(UUIDParamSchema),
    validSchema(UpdatePagoSchema),
    (c) => ctrl.update(c),
  );
  router.delete("/:id", adminMiddleware, validParams(UUIDParamSchema), (c) => ctrl.delete(c));

  return router;
}
