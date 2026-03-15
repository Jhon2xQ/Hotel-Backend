import { Hono } from "hono";
import { AppHono, AppVariables } from "../common/types/app.types";
import { PrismaClient } from "../../generated/prisma/client";
import { HabitationRepository } from "../infrastructure/repositories/habitation.repository";
import { CreateHabitationUseCase } from "../application/use-cases/create-habitation.use-case";
import { ListHabitationsUseCase } from "../application/use-cases/list-habitations.use-case";
import { FindHabitationByIdUseCase } from "../application/use-cases/find-habitation-by-id.use-case";
import { UpdateHabitationUseCase } from "../application/use-cases/update-habitation.use-case";
import { UpdateHabitationStatusUseCase } from "../application/use-cases/update-habitation-status.use-case";
import { DeleteHabitationUseCase } from "../application/use-cases/delete-habitation.use-case";
import { HabitationController } from "../presentation/controllers/habitation.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { adminMiddleware } from "../presentation/middlewares/admin.middleware";
import { validSchema } from "../presentation/middlewares/valid.middleware";
import {
  CreateHabitationSchema,
  UpdateHabitationSchema,
  UpdateHabitationStatusSchema,
} from "../presentation/schemas/habitation.schema";

export function createHabitationRoutes(prismaClient: PrismaClient): AppHono {
  const repository = new HabitationRepository(prismaClient);

  const createUseCase = new CreateHabitationUseCase(repository);
  const listUseCase = new ListHabitationsUseCase(repository);
  const findByIdUseCase = new FindHabitationByIdUseCase(repository);
  const updateUseCase = new UpdateHabitationUseCase(repository);
  const updateStatusUseCase = new UpdateHabitationStatusUseCase(repository);
  const deleteUseCase = new DeleteHabitationUseCase(repository);

  const controller = new HabitationController(
    createUseCase,
    listUseCase,
    findByIdUseCase,
    updateUseCase,
    updateStatusUseCase,
    deleteUseCase,
  );

  const router = new Hono<{ Variables: AppVariables }>();

  // Todas las rutas requieren autorizacion
  router.use("*", authMiddleware);

  // Rutas publicas (usuarios autenticados)
  router.get("/", controller.list.bind(controller));
  router.get("/:id", controller.findById.bind(controller));
  router.patch("/:id/estado", validSchema(UpdateHabitationStatusSchema), controller.updateStatus.bind(controller));

  // rutas para ADMIN
  router.post("/", adminMiddleware, validSchema(CreateHabitationSchema), controller.create.bind(controller));
  router.put("/:id", adminMiddleware, validSchema(UpdateHabitationSchema), controller.update.bind(controller));
  router.delete("/:id", adminMiddleware, controller.delete.bind(controller));

  return router;
}
