import { Hono } from "hono";
import { AppHono, AppVariables } from "../common/types/app.types";
import { PrismaClient } from "../../generated/prisma/client";
import { HabitacionRepository } from "../infrastructure/repositories/habitacion.repository";
import { TipoHabitacionRepository } from "../infrastructure/repositories/tipo-habitacion.repository";
import { MuebleRepository } from "../infrastructure/repositories/mueble.repository";
import { CreateHabitacionUseCase } from "../application/use-cases/habitacion/create-habitacion.use-case";
import { ListHabitacionUseCase } from "../application/use-cases/habitacion/list-habitacion.use-case";
import { FindHabitacionByIdUseCase } from "../application/use-cases/habitacion/find-habitacion-by-id.use-case";
import { UpdateHabitacionUseCase } from "../application/use-cases/habitacion/update-habitacion.use-case";
import { UpdateHabitacionStatusUseCase } from "../application/use-cases/habitacion/update-habitacion-status.use-case";
import { DeleteHabitacionUseCase } from "../application/use-cases/habitacion/delete-habitacion.use-case";
import { SearchAvailableHabitacionesUseCase } from "../application/use-cases/habitacion/search-available-habitaciones.use-case";
import { FindHabitacionByIdWithPriceUseCase } from "../application/use-cases/habitacion/find-habitacion-by-id-with-price.use-case";
import { HabitacionController } from "../presentation/controllers/habitacion.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { adminMiddleware } from "../presentation/middlewares/admin.middleware";
import { validSchema, validParams, validQuery } from "../presentation/middlewares/valid.middleware";
import { parseFormDataMiddleware } from "../presentation/middlewares/parse-form-data.middleware";
import { CreateHabitacionSchema, UpdateHabitacionSchema, UpdateHabitacionStatusSchema, SearchAvailableHabitacionesSchema } from "../presentation/schemas/habitacion.schema";
import { UUIDParamSchema } from "../presentation/schemas/tipo-habitacion.schema";

export function createHabitacionRoutes(prismaClient: PrismaClient): AppHono {
  const repository = new HabitacionRepository(prismaClient);
  const tipoHabitacionRepository = new TipoHabitacionRepository(prismaClient);
  const furnitureRepository = new MuebleRepository(prismaClient);

  const createUseCase = new CreateHabitacionUseCase(repository, tipoHabitacionRepository);
  const listUseCase = new ListHabitacionUseCase(repository);
  const findByIdUseCase = new FindHabitacionByIdUseCase(repository);
  const updateUseCase = new UpdateHabitacionUseCase(repository, tipoHabitacionRepository, furnitureRepository);
  const updateStatusUseCase = new UpdateHabitacionStatusUseCase(repository);
  const deleteUseCase = new DeleteHabitacionUseCase(repository);
  const searchAvailableUseCase = new SearchAvailableHabitacionesUseCase(repository);
  const findByIdWithPriceUseCase = new FindHabitacionByIdWithPriceUseCase(repository);

  const controller = new HabitacionController(createUseCase, listUseCase, findByIdUseCase, updateUseCase, updateStatusUseCase, deleteUseCase, searchAvailableUseCase, findByIdWithPriceUseCase);

  const router = new Hono<{ Variables: AppVariables }>();

  //enpoints para administración
  router.post("/", authMiddleware, parseFormDataMiddleware, validSchema(CreateHabitacionSchema), controller.create.bind(controller));
  router.get("/", authMiddleware, controller.list.bind(controller));
  router.get("/:id", authMiddleware, validParams(UUIDParamSchema), controller.findById.bind(controller));
  router.put("/:id", authMiddleware, validParams(UUIDParamSchema), parseFormDataMiddleware, validSchema(UpdateHabitacionSchema), controller.update.bind(controller));
  router.patch("/:id/estado", authMiddleware, validParams(UUIDParamSchema), validSchema(UpdateHabitacionStatusSchema), controller.updateStatus.bind(controller));
  router.delete("/:id", authMiddleware, validParams(UUIDParamSchema), controller.delete.bind(controller));

  //enpoints para la página
  router.get("/disponibles", validQuery(SearchAvailableHabitacionesSchema), controller.searchAvailable.bind(controller));
  router.get("/disponibles/:id", validParams(UUIDParamSchema), controller.findByIdWithPrice.bind(controller));

  return router;
}
