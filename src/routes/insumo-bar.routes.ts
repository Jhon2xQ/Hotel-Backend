import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { InsumoBarController } from "../presentation/controllers/insumo-bar.controller";
import { validSchema, validParams, validQuery } from "../presentation/middlewares/valid.middleware";
import {
  CreateInsumoBarSchema,
  UpdateInsumoBarSchema,
  CreateMovimientoBarSchema,
  MovimientoBarFiltersSchema,
  UUIDParamSchema,
} from "../presentation/schemas/insumo-bar.schema";

export function createInsumoBarRoutes(): AppHono {
  const ctrl = container.resolve(InsumoBarController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.get("/", (c) => ctrl.list(c));
  router.get("/:id", validParams(UUIDParamSchema), (c) => ctrl.findById(c));
  router.post("/", validSchema(CreateInsumoBarSchema), (c) => ctrl.create(c));
  router.put("/:id", validParams(UUIDParamSchema), validSchema(UpdateInsumoBarSchema), (c) => ctrl.update(c));
  router.delete("/:id", validParams(UUIDParamSchema), (c) => ctrl.delete(c));

  return router;
}

export function createMovimientoBarRoutes(): AppHono {
  const ctrl = container.resolve(InsumoBarController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.get("/", validQuery(MovimientoBarFiltersSchema), (c) => ctrl.listarMovimientos(c));
  router.post("/", validSchema(CreateMovimientoBarSchema), (c) => ctrl.registrarMovimiento(c));

  return router;
}