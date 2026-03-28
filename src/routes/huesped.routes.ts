import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { HuespedController } from "../presentation/controllers/huesped.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { validSchema, validParams, validQuery } from "../presentation/middlewares/valid.middleware";
import { CreateHuespedSchema, UpdateHuespedSchema, HuespedIdSchema } from "../presentation/schemas/huesped.schema";
import { PaginationQuerySchema } from "../presentation/schemas/pagination.schema";

export function createHuespedRoutes(): AppHono {
  const controller = container.resolve(HuespedController);

  const router = new Hono<{ Variables: AppVariables }>();

  router.use("*", authMiddleware);

  router.get("/", validQuery(PaginationQuerySchema), controller.listPaginated.bind(controller));
  router.get("/:id", validParams(HuespedIdSchema), controller.findById.bind(controller));
  router.post("/", validSchema(CreateHuespedSchema), controller.create.bind(controller));
  router.put(
    "/:id",
    validParams(HuespedIdSchema),
    validSchema(UpdateHuespedSchema),
    controller.update.bind(controller),
  );
  router.delete("/:id", validParams(HuespedIdSchema), controller.delete.bind(controller));

  return router;
}
