import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { FolioController } from "../presentation/controllers/folio.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { requireRoles } from "../presentation/middlewares/roles.middleware";
import { validSchema, validParams, validQuery } from "../presentation/middlewares/valid.middleware";
import { CreateFolioSchema, UpdateFolioSchema, AddProductoSchema, AddServicioSchema, UUIDParamSchema, ListFolioQuerySchema } from "../presentation/schemas/folio.schema";
import { ROLES } from "../common/constants/roles";

export function createFolioRoutes(): AppHono {
  const ctrl = container.resolve(FolioController);
  const router = new Hono<{ Variables: AppVariables }>();

  router.use("*", authMiddleware);

  router.get("/", validQuery(ListFolioQuerySchema), (c) => ctrl.listPaginated(c));
  router.get("/:id", validParams(UUIDParamSchema), (c) => ctrl.findById(c));
  router.post("/", requireRoles(ROLES.ADMIN, ROLES.RECEPCIONISTA), validSchema(CreateFolioSchema), (c) => ctrl.create(c));
  router.put("/:id", requireRoles(ROLES.ADMIN, ROLES.RECEPCIONISTA), validParams(UUIDParamSchema), validSchema(UpdateFolioSchema), (c) => ctrl.update(c));
  router.delete("/:id", requireRoles(ROLES.ADMIN), validParams(UUIDParamSchema), (c) => ctrl.delete(c));

  router.post("/:id/productos", requireRoles(ROLES.ADMIN, ROLES.RECEPCIONISTA), validParams(UUIDParamSchema), validSchema(AddProductoSchema), (c) => ctrl.addProducto(c));
  router.post("/:id/servicios", requireRoles(ROLES.ADMIN, ROLES.RECEPCIONISTA), validParams(UUIDParamSchema), validSchema(AddServicioSchema), (c) => ctrl.addServicio(c));
  router.get("/:id/consumos", validParams(UUIDParamSchema), (c) => ctrl.getConsumos(c));

  return router;
}
