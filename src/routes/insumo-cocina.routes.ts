import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { InsumoCocinaController } from "../presentation/controllers/insumo-cocina.controller";
import { validSchema, validParams, validQuery } from "../presentation/middlewares/valid.middleware";
import {
  CreateInsumoCocinaSchema,
  UpdateInsumoCocinaSchema,
  CreateMovimientoCocinaSchema,
  MovimientoCocinaFiltersSchema,
  UUIDParamSchema,
} from "../presentation/schemas/insumo-cocina.schema";

export function createInsumoCocinaRoutes(): AppHono {
  const ctrl = container.resolve(InsumoCocinaController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.get("/", (c) => ctrl.list(c));
  router.get("/:id", validParams(UUIDParamSchema), (c) => ctrl.findById(c));
  router.post("/", validSchema(CreateInsumoCocinaSchema), (c) => ctrl.create(c));
  router.put("/:id", validParams(UUIDParamSchema), validSchema(UpdateInsumoCocinaSchema), (c) => ctrl.update(c));
  router.delete("/:id", validParams(UUIDParamSchema), (c) => ctrl.delete(c));

  return router;
}

export function createMovimientoCocinaRoutes(): AppHono {
  const ctrl = container.resolve(InsumoCocinaController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.get("/", validQuery(MovimientoCocinaFiltersSchema), (c) => ctrl.listarMovimientos(c));
  router.post("/", validSchema(CreateMovimientoCocinaSchema), (c) => ctrl.registrarMovimiento(c));

  return router;
}