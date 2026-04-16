import { Hono } from "hono";
import { container } from "tsyringe";
import { AppHono, AppVariables } from "../common/types/app.types";
import { FolioController } from "../presentation/controllers/folio.controller";
import { validSchema, validParams } from "../presentation/middlewares/valid.middleware";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { requireRoles } from "../presentation/middlewares/roles.middleware";
import { ROLES } from "../common/constants/roles";
import { CreateFolioSchema, UpdateFolioSchema, CloseFolioSchema, UUIDParamSchema } from "../presentation/schemas/folio.schema";

export function createFolioRoutes(): AppHono {
  const ctrl = container.resolve(FolioController);
  const router = new Hono<{ Variables: AppVariables }>();

  //router.use("*", requireRoles(ROLES.ADMIN, ROLES.RECEPCIONISTA));

  router.get("/", (c) => ctrl.list(c));
  router.get("/:id", validParams(UUIDParamSchema), (c) => ctrl.findById(c));
  router.post("/", validSchema(CreateFolioSchema), (c) => ctrl.create(c));
  router.put("/:id", validParams(UUIDParamSchema), validSchema(UpdateFolioSchema), (c) => ctrl.update(c));
  router.delete("/:id", validParams(UUIDParamSchema), (c) => ctrl.delete(c));
  router.post("/:id/close", validParams(UUIDParamSchema), validSchema(CloseFolioSchema), (c) => ctrl.close(c));

  return router;
}
