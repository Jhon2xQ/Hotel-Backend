import { Hono } from "hono";
import { AppHono, AppVariables } from "../common/types/app.types";
import { PrismaClient } from "../../generated/prisma/client";
import { MuebleRepository } from "../infrastructure/repositories/mueble.repository";
import { HabitacionRepository } from "../infrastructure/repositories/habitacion.repository";
import { CreateMuebleUseCase } from "../application/use-cases/mueble/create-mueble.use-case";
import { ListMueblesUseCase } from "../application/use-cases/mueble/list-mueble.use-case";
import { FindMuebleByIdUseCase } from "../application/use-cases/mueble/find-mueble-by-id.use-case";
import { UpdateMuebleUseCase } from "../application/use-cases/mueble/update-mueble.use-case";
import { DeleteMuebleUseCase } from "../application/use-cases/mueble/delete-mueble.use-case";
import { MuebleController } from "../presentation/controllers/mueble.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { adminMiddleware } from "../presentation/middlewares/admin.middleware";
import { validSchema, validParams } from "../presentation/middlewares/valid.middleware";
import {
  CreateMuebleSchema,
  UpdateMuebleSchema,
  UUIDParamSchema,
} from "../presentation/schemas/mueble.schema";
import { CategoriaMuebleRepository } from "../infrastructure/repositories/categoria-mueble.repository";

export function createMuebleRoutes(prismaClient: PrismaClient): AppHono {
  const repository = new MuebleRepository(prismaClient);
  const habitacionRepository = new HabitacionRepository(prismaClient);
  const categoriaRepository = new CategoriaMuebleRepository(prismaClient);

  const createUseCase = new CreateMuebleUseCase(repository, habitacionRepository, categoriaRepository);
  const listUseCase = new ListMueblesUseCase(repository);
  const findByIdUseCase = new FindMuebleByIdUseCase(repository);
  const updateUseCase = new UpdateMuebleUseCase(repository, habitacionRepository);
  const deleteUseCase = new DeleteMuebleUseCase(repository);

  const controller = new MuebleController(
    createUseCase,
    listUseCase,
    findByIdUseCase,
    updateUseCase,
    deleteUseCase,
  );

  const router = new Hono<{ Variables: AppVariables }>();

  router.use("*", authMiddleware);

  router.get("/", adminMiddleware, controller.list.bind(controller));
  router.get("/:id", adminMiddleware, validParams(UUIDParamSchema), controller.findById.bind(controller));

  router.post("/", adminMiddleware, validSchema(CreateMuebleSchema), controller.create.bind(controller));
  router.put(
    "/:id", adminMiddleware,
    validParams(UUIDParamSchema),
    validSchema(UpdateMuebleSchema),
    controller.update.bind(controller),
  );
  router.delete("/:id", adminMiddleware, validParams(UUIDParamSchema), controller.delete.bind(controller));

  return router;
}
