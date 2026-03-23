import { Hono } from "hono";
import { AppHono, AppVariables } from "../common/types/app.types";
import { PrismaClient } from "../../generated/prisma/client";
import { TarifaRepository } from "../infrastructure/repositories/tarifa.repository";
import { CreateTarifaUseCase } from "../application/use-cases/tarifa/create-tarifa.use-case";
import { ListTarifaUseCase } from "../application/use-cases/tarifa/list-tarifa.use-case";
import { FindTarifaByIdUseCase } from "../application/use-cases/tarifa/find-tarifa-by-id.use-case";
import { UpdateTarifaUseCase } from "../application/use-cases/tarifa/update-tarifa.use-case";
import { DeleteTarifaUseCase } from "../application/use-cases/tarifa/delete-tarifa.use-case";
import { TarifaController } from "../presentation/controllers/tarifa.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { adminMiddleware } from "../presentation/middlewares/admin.middleware";
import { validSchema, validParams } from "../presentation/middlewares/valid.middleware";
import { CreateTarifaSchema, UpdateTarifaSchema, UUIDParamSchema } from "../presentation/schemas/tarifa.schema";

export function createTarifaRoutes(prismaClient: PrismaClient): AppHono {
  const repository = new TarifaRepository(prismaClient);

  const createUseCase = new CreateTarifaUseCase(repository);
  const listUseCase = new ListTarifaUseCase(repository);
  const findByIdUseCase = new FindTarifaByIdUseCase(repository);
  const updateUseCase = new UpdateTarifaUseCase(repository);
  const deleteUseCase = new DeleteTarifaUseCase(repository);

  const controller = new TarifaController(createUseCase, listUseCase, findByIdUseCase, updateUseCase, deleteUseCase);

  const router = new Hono<{ Variables: AppVariables }>();

  router.use("*", authMiddleware);

  router.post("/", adminMiddleware, validSchema(CreateTarifaSchema), controller.create.bind(controller));
  router.get("/", controller.list.bind(controller));
  router.get("/:id", validParams(UUIDParamSchema), controller.findById.bind(controller));
  router.put(
    "/:id",
    adminMiddleware,
    validParams(UUIDParamSchema),
    validSchema(UpdateTarifaSchema),
    controller.update.bind(controller),
  );
  router.delete("/:id", adminMiddleware, validParams(UUIDParamSchema), controller.delete.bind(controller));

  return router;
}
