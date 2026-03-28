import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { EstanciaController } from "../presentation/controllers/estancia.controller";
import { validSchema } from "../presentation/middlewares/valid.middleware";
import { CreateEstanciaSchema, UpdateEstanciaSchema, CheckoutEstanciaSchema } from "../presentation/schemas/estancia.schema";

export function createEstanciaRoutes(): AppHono {
  const ctrl = container.resolve(EstanciaController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.get("/", (c) => ctrl.list(c));
  router.get("/:id", (c) => ctrl.findById(c));
  router.post("/", validSchema(CreateEstanciaSchema), (c) => ctrl.create(c));
  router.put("/:id", validSchema(UpdateEstanciaSchema), (c) => ctrl.update(c));
  router.patch("/:id/checkout", validSchema(CheckoutEstanciaSchema), (c) => ctrl.checkout(c));
  router.delete("/:id", (c) => ctrl.delete(c));

  return router;
}
