import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { ReservaController } from "../presentation/controllers/reserva.controller";
import { validSchema, validQuery } from "../presentation/middlewares/valid.middleware";
import { CreateReservaSchema, UpdateReservaSchema, CancelReservaSchema, UpdateEstadoReservaSchema, ReservaQuerySchema } from "../presentation/schemas/reserva.schema";

export function createReservaRoutes(): AppHono {
  const ctrl = container.resolve(ReservaController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.get("/", validQuery(ReservaQuerySchema), (c) => ctrl.listPaginated(c));
  router.get("/:id", (c) => ctrl.findById(c));
  router.post("/", validSchema(CreateReservaSchema), (c) => ctrl.create(c));
  router.put("/:id", validSchema(UpdateReservaSchema), (c) => ctrl.update(c));
  router.patch("/:id/cancel", validSchema(CancelReservaSchema), (c) => ctrl.cancel(c));
  router.patch("/:id/estado", validSchema(UpdateEstadoReservaSchema), (c) => ctrl.updateEstado(c));
  router.delete("/:id", (c) => ctrl.delete(c));

  return router;
}
