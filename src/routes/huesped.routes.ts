import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { HuespedController } from "../presentation/controllers/huesped.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { validSchema, validParams, validQuery } from "../presentation/middlewares/valid.middleware";
import { CreateHuespedSchema, UpdateHuespedSchema, HuespedIdSchema } from "../presentation/schemas/huesped.schema";
import { PaginationQuerySchema } from "../presentation/schemas/pagination.schema";

export function createHuespedRoutes(): AppHono {
  const ctrl = container.resolve(HuespedController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.use("*", authMiddleware);
  router.get("/", validQuery(PaginationQuerySchema), (c) => ctrl.listPaginated(c));
  router.get("/:id", validParams(HuespedIdSchema), (c) => ctrl.findById(c));
  router.post("/", validSchema(CreateHuespedSchema), (c) => ctrl.create(c));
  router.put(
    "/:id",
    validParams(HuespedIdSchema),
    validSchema(UpdateHuespedSchema),
    (c) => ctrl.update(c),
  );
  router.delete("/:id", validParams(HuespedIdSchema), (c) => ctrl.delete(c));

  return router;
}
