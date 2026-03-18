import { Hono } from "hono";
import { AppHono, AppVariables } from "../common/types/app.types";
import { PrismaClient } from "../../generated/prisma/client";
import { TipoHabitacionRepository } from "../infrastructure/repositories/tipo-habitacion.repository";
import { CreateTipoHabitacionUseCase } from "../application/use-cases/tipo-habitacion/create-tipo-habitacion.use-case";
import { ListTipoHabitacionUseCase } from "../application/use-cases/tipo-habitacion/list-tipo-habitacion.use-case";
import { FindTipoHabitacionByIdUseCase } from "../application/use-cases/tipo-habitacion/find-tipo-habitacion-by-id.use-case";
import { UpdateTipoHabitacionUseCase } from "../application/use-cases/tipo-habitacion/update-tipo-habitacion.use-case";
import { DeleteTipoHabitacionUseCase } from "../application/use-cases/tipo-habitacion/delete-tipo-habitacion.use-case";
import { TipoHabitacionController } from "../presentation/controllers/tipo-habitacion.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { adminMiddleware } from "../presentation/middlewares/admin.middleware";
import { validSchema, validParams } from "../presentation/middlewares/valid.middleware";
import {
  CreateTipoHabitacionSchema,
  UpdateTipoHabitacionSchema,
  UUIDParamSchema,
} from "../presentation/schemas/tipo-habitacion.schema";

export function createTipoHabitacionRoutes(prismaClient: PrismaClient): AppHono {
  const repository = new TipoHabitacionRepository(prismaClient);

  const createUseCase = new CreateTipoHabitacionUseCase(repository);
  const listUseCase = new ListTipoHabitacionUseCase(repository);
  const findByIdUseCase = new FindTipoHabitacionByIdUseCase(repository);
  const updateUseCase = new UpdateTipoHabitacionUseCase(repository);
  const deleteUseCase = new DeleteTipoHabitacionUseCase(repository);

  const controller = new TipoHabitacionController(
    createUseCase,
    listUseCase,
    findByIdUseCase,
    updateUseCase,
    deleteUseCase,
  );

  const router = new Hono<{ Variables: AppVariables }>();

  router.use("*", authMiddleware);

  router.post("/", adminMiddleware, validSchema(CreateTipoHabitacionSchema), controller.create.bind(controller));
  router.get("/", controller.list.bind(controller));
  router.get("/:id", validParams(UUIDParamSchema), controller.findById.bind(controller));
  router.put(
    "/:id",
    adminMiddleware,
    validParams(UUIDParamSchema),
    validSchema(UpdateTipoHabitacionSchema),
    controller.update.bind(controller),
  );
  router.delete("/:id", adminMiddleware, validParams(UUIDParamSchema), controller.delete.bind(controller));

  return router;
}
