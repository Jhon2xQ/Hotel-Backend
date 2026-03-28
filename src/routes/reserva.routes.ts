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
  const controller = container.resolve(ReservaController);

  const router = new Hono<{ Variables: AppVariables }>();

  router.use("*", authMiddleware);

  router.get("/", controller.list.bind(controller));
  router.get("/:id", controller.findById.bind(controller));
  router.post("/", validSchema(CreateReservaSchema), controller.create.bind(controller));
  router.put("/:id", validSchema(UpdateReservaSchema), controller.update.bind(controller));
  router.delete("/:id", controller.delete.bind(controller));
  router.patch("/:id/cancel", validSchema(CancelReservaSchema), controller.cancel.bind(controller));
  router.patch(
    "/:id/estado",
    adminMiddleware,
    validSchema(UpdateEstadoReservaSchema),
    controller.updateEstado.bind(controller),
  );

  return router;
}
