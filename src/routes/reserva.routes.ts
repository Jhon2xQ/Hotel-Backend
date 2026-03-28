import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { ReservaController } from "../presentation/controllers/reserva.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { adminMiddleware } from "../presentation/middlewares/admin.middleware";
import { validSchema } from "../presentation/middlewares/valid.middleware";
import {
  CreateReservaSchema,
  UpdateReservaSchema,
  CancelReservaSchema,
  UpdateEstadoReservaSchema,
} from "../presentation/schemas/reserva.schema";

export function createReservaRoutes(): AppHono {
  const ctrl = container.resolve(ReservaController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.use("*", authMiddleware);
  router.get("/", (c) => ctrl.list(c));
  router.get("/:id", (c) => ctrl.findById(c));
  router.post("/", validSchema(CreateReservaSchema), (c) => ctrl.create(c));
  router.put("/:id", validSchema(UpdateReservaSchema), (c) => ctrl.update(c));
  router.delete("/:id", (c) => ctrl.delete(c));
  router.patch("/:id/cancel", validSchema(CancelReservaSchema), (c) => ctrl.cancel(c));
  router.patch(
    "/:id/estado",
    adminMiddleware,
    validSchema(UpdateEstadoReservaSchema),
    (c) => ctrl.updateEstado(c),
  );

  return router;
}
