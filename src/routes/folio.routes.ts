import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { FolioController } from "../presentation/controllers/folio.controller";
import { validSchema, validParams, validQuery } from "../presentation/middlewares/valid.middleware";
import {
  CreateFolioSchema,
  UpdateFolioSchema,
  AddProductoSchema,
  AddServicioSchema,
  UUIDParamSchema,
  ListFolioQuerySchema,
} from "../presentation/schemas/folio.schema";

export function createFolioRoutes(): AppHono {
  const ctrl = container.resolve(FolioController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.get("/", validQuery(ListFolioQuerySchema), (c) => ctrl.listPaginated(c));
  router.get("/:id", validParams(UUIDParamSchema), (c) => ctrl.findById(c));
  router.post("/", validSchema(CreateFolioSchema), (c) => ctrl.create(c));
  router.put("/:id", validParams(UUIDParamSchema), validSchema(UpdateFolioSchema), (c) => ctrl.update(c));
  router.delete("/:id", validParams(UUIDParamSchema), (c) => ctrl.delete(c));
  router.post("/:id/productos", validParams(UUIDParamSchema), validSchema(AddProductoSchema), (c) => ctrl.addProducto(c));
  router.post("/:id/servicios", validParams(UUIDParamSchema), validSchema(AddServicioSchema), (c) => ctrl.addServicio(c));
  router.get("/:id/consumos", validParams(UUIDParamSchema), (c) => ctrl.getConsumos(c));

  return router;
}
