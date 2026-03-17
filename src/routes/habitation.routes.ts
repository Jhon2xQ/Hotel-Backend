import { Hono } from "hono";
import { AppHono, AppVariables } from "../common/types/app.types";
import { PrismaClient } from "../../generated/prisma/client";
import { HabitationRepository } from "../infrastructure/repositories/habitation.repository";
import { CreateHabitationUseCase } from "../application/use-cases/habitation/create-habitation.use-case";
import { ListHabitationsUseCase } from "../application/use-cases/habitation/list-habitations.use-case";
import { FindHabitationByIdUseCase } from "../application/use-cases/habitation/find-habitation-by-id.use-case";
import { UpdateHabitationUseCase } from "../application/use-cases/habitation/update-habitation.use-case";
import { DeleteHabitationUseCase } from "../application/use-cases/habitation/delete-habitation.use-case";
import { HabitationController } from "../presentation/controllers/habitation.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { adminMiddleware } from "../presentation/middlewares/admin.middleware";
import { validSchema, validParams } from "../presentation/middlewares/valid.middleware";
import {
  CreateHabitationSchema,
  UpdateHabitationSchema,
  UpdateHabitationStatusSchema,
  UUIDParamSchema,
} from "../presentation/schemas/habitation.schema";

export function createHabitationRoutes(prismaClient: PrismaClient): AppHono {
  const repository = new HabitationRepository(prismaClient);

  const createUseCase = new CreateHabitationUseCase(repository);
  const listUseCase = new ListHabitationsUseCase(repository);
  const findByIdUseCase = new FindHabitationByIdUseCase(repository);
  const updateUseCase = new UpdateHabitationUseCase(repository);
  const deleteUseCase = new DeleteHabitationUseCase(repository);

  const controller = new HabitationController(
    createUseCase,
    listUseCase,
    findByIdUseCase,
    updateUseCase,
    deleteUseCase,
  );

  const router = new Hono<{ Variables: AppVariables }>();

  // Todas las rutas requieren autorizacion
  router.use("*", authMiddleware);

  // Rutas publicas (usuarios autenticados)
  router.get("/", controller.list.bind(controller));
  router.get("/:id", validParams(UUIDParamSchema), controller.findById.bind(controller));
  router.patch(
    "/:id/estado",
    validParams(UUIDParamSchema),
    validSchema(UpdateHabitationStatusSchema),
    controller.update.bind(controller),
  );

  // rutas para ADMIN
  router.post("/", adminMiddleware, validSchema(CreateHabitationSchema), controller.create.bind(controller));
  router.put(
    "/:id",
    adminMiddleware,
    validParams(UUIDParamSchema),
    validSchema(UpdateHabitationSchema),
    controller.update.bind(controller),
  );
  router.delete("/:id", adminMiddleware, validParams(UUIDParamSchema), controller.delete.bind(controller));

  return router;
}
