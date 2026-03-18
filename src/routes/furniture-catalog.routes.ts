import { Hono } from "hono";
import { AppHono, AppVariables } from "../common/types/app.types";
import { PrismaClient } from "../../generated/prisma/client";
import { FurnitureCatalogRepository } from "../infrastructure/repositories/furniture-catalog.repository";
import { HabitacionRepository } from "../infrastructure/repositories/habitacion.repository";
import { CreateFurnitureCatalogUseCase } from "../application/use-cases/furniture-catalog/create-furniture-catalog.use-case";
import { ListFurnitureCatalogsUseCase } from "../application/use-cases/furniture-catalog/list-furniture-catalogs.use-case";
import { FindFurnitureCatalogByIdUseCase } from "../application/use-cases/furniture-catalog/find-furniture-catalog-by-id.use-case";
import { UpdateFurnitureCatalogUseCase } from "../application/use-cases/furniture-catalog/update-furniture-catalog.use-case";
import { DeleteFurnitureCatalogUseCase } from "../application/use-cases/furniture-catalog/delete-furniture-catalog.use-case";
import { FurnitureCatalogController } from "../presentation/controllers/furniture-catalog.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { adminMiddleware } from "../presentation/middlewares/admin.middleware";
import { validSchema, validParams } from "../presentation/middlewares/valid.middleware";
import {
  CreateFurnitureCatalogSchema,
  UpdateFurnitureCatalogSchema,
  UUIDParamSchema,
} from "../presentation/schemas/furniture-catalog.schema";

export function createFurnitureCatalogRoutes(prismaClient: PrismaClient): AppHono {
  const repository = new FurnitureCatalogRepository(prismaClient);
  const habitacionRepository = new HabitacionRepository(prismaClient);

  const createUseCase = new CreateFurnitureCatalogUseCase(repository, habitacionRepository);
  const listUseCase = new ListFurnitureCatalogsUseCase(repository);
  const findByIdUseCase = new FindFurnitureCatalogByIdUseCase(repository);
  const updateUseCase = new UpdateFurnitureCatalogUseCase(repository, habitacionRepository);
  const deleteUseCase = new DeleteFurnitureCatalogUseCase(repository);

  const controller = new FurnitureCatalogController(
    createUseCase,
    listUseCase,
    findByIdUseCase,
    updateUseCase,
    deleteUseCase,
  );

  const router = new Hono<{ Variables: AppVariables }>();

  //router.use("*", authMiddleware);

  router.get("/", controller.list.bind(controller));
  router.get("/:id", validParams(UUIDParamSchema), controller.findById.bind(controller));

  router.post("/", validSchema(CreateFurnitureCatalogSchema), controller.create.bind(controller));
  router.put(
    "/:id",
    validParams(UUIDParamSchema),
    validSchema(UpdateFurnitureCatalogSchema),
    controller.update.bind(controller),
  );
  router.delete("/:id", validParams(UUIDParamSchema), controller.delete.bind(controller));

  return router;
}
