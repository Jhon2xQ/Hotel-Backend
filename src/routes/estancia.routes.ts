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
  const ctrl = container.resolve(EstanciaController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.use("*", authMiddleware);
  router.get("/", (c) => ctrl.list(c));
  router.get("/:id", (c) => ctrl.findById(c));
  router.post("/", adminMiddleware, validSchema(CreateEstanciaSchema), (c) => ctrl.create(c));
  router.put("/:id", adminMiddleware, validSchema(UpdateEstanciaSchema), (c) => ctrl.update(c));
  router.delete("/:id", adminMiddleware, (c) => ctrl.delete(c));
  router.patch(
    "/:id/checkout",
    adminMiddleware,
    validSchema(CheckoutEstanciaSchema),
    (c) => ctrl.checkout(c),
  );

  return router;
}
