import { Hono } from "hono";
import { AppHono, AppVariables } from "../common/types/app.types";
import { PrismaClient } from "../../generated/prisma/client";
import { HuespedRepository } from "../infrastructure/repositories/huesped.repository";
import { CreateHuespedUseCase } from "../application/use-cases/huesped/create-huesped.use-case";
import { ListHuespedUseCase } from "../application/use-cases/huesped/list-huesped.use-case";
import { FindHuespedByIdUseCase } from "../application/use-cases/huesped/find-huesped-by-id.use-case";
import { UpdateHuespedUseCase } from "../application/use-cases/huesped/update-huesped.use-case";
import { DeleteHuespedUseCase } from "../application/use-cases/huesped/delete-huesped.use-case";
import { HuespedController } from "../presentation/controllers/huesped.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { validSchema, validParams } from "../presentation/middlewares/valid.middleware";
import { CreateHuespedSchema, UpdateHuespedSchema, HuespedIdSchema } from "../presentation/schemas/huesped.schema";

export function createHuespedRoutes(prismaClient: PrismaClient): AppHono {
  const repository = new HuespedRepository(prismaClient);
  const createUseCase = new CreateHuespedUseCase(repository);
  const listUseCase = new ListHuespedUseCase(repository);
  const findByIdUseCase = new FindHuespedByIdUseCase(repository);
  const updateUseCase = new UpdateHuespedUseCase(repository);
  const deleteUseCase = new DeleteHuespedUseCase(repository);

  const controller = new HuespedController(createUseCase, listUseCase, findByIdUseCase, updateUseCase, deleteUseCase);

  const router = new Hono<{ Variables: AppVariables }>();

  router.use("*", authMiddleware);

  router.get("/", controller.list.bind(controller));
  router.get("/:id", validParams(HuespedIdSchema), controller.findById.bind(controller));
  router.post("/", validSchema(CreateHuespedSchema), controller.create.bind(controller));
  router.put(
    "/:id",
    validParams(HuespedIdSchema),
    validSchema(UpdateHuespedSchema),
    controller.update.bind(controller),
  );
  router.delete("/:id", validParams(HuespedIdSchema), controller.delete.bind(controller));

  return router;
}
