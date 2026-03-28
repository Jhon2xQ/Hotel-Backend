import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { EstanciaController } from "../presentation/controllers/estancia.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { adminMiddleware } from "../presentation/middlewares/admin.middleware";
import { validSchema } from "../presentation/middlewares/valid.middleware";
import {
  CreateEstanciaSchema,
  UpdateEstanciaSchema,
  CheckoutEstanciaSchema,
} from "../presentation/schemas/estancia.schema";

export function createEstanciaRoutes(): AppHono {
  const controller = container.resolve(EstanciaController);

  const router = new Hono<{ Variables: AppVariables }>();

  router.use("*", authMiddleware);

  router.get("/", controller.list.bind(controller));
  router.get("/:id", controller.findById.bind(controller));
  router.post("/", adminMiddleware, validSchema(CreateEstanciaSchema), controller.create.bind(controller));
  router.put("/:id", adminMiddleware, validSchema(UpdateEstanciaSchema), controller.update.bind(controller));
  router.delete("/:id", adminMiddleware, controller.delete.bind(controller));
  router.patch(
    "/:id/checkout",
    adminMiddleware,
    validSchema(CheckoutEstanciaSchema),
    controller.checkout.bind(controller),
  );

  return router;
}
