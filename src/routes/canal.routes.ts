import { Hono } from "hono";
import { AppHono, AppVariables } from "../common/types/app.types";
import { PrismaClient } from "../../generated/prisma/client";
import { CanalRepository } from "../infrastructure/repositories/canal.repository";
import { CreateCanalUseCase } from "../application/use-cases/canal/create-canal.use-case";
import { ListCanalUseCase } from "../application/use-cases/canal/list-canal.use-case";
import { FindCanalByIdUseCase } from "../application/use-cases/canal/find-canal-by-id.use-case";
import { UpdateCanalUseCase } from "../application/use-cases/canal/update-canal.use-case";
import { DeleteCanalUseCase } from "../application/use-cases/canal/delete-canal.use-case";
import { CanalController } from "../presentation/controllers/canal.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { adminMiddleware } from "../presentation/middlewares/admin.middleware";
import { validSchema, validParams } from "../presentation/middlewares/valid.middleware";
import { CreateCanalSchema, UpdateCanalSchema, UUIDParamSchema } from "../presentation/schemas/canal.schema";

export function createCanalRoutes(prismaClient: PrismaClient): AppHono {
  const repository = new CanalRepository(prismaClient);

  const createUseCase = new CreateCanalUseCase(repository);
  const listUseCase = new ListCanalUseCase(repository);
  const findByIdUseCase = new FindCanalByIdUseCase(repository);
  const updateUseCase = new UpdateCanalUseCase(repository);
  const deleteUseCase = new DeleteCanalUseCase(repository);

  const controller = new CanalController(createUseCase, listUseCase, findByIdUseCase, updateUseCase, deleteUseCase);

  const router = new Hono<{ Variables: AppVariables }>();

  router.use("*", authMiddleware);

  router.post("/", adminMiddleware, validSchema(CreateCanalSchema), controller.create.bind(controller));
  router.get("/", controller.list.bind(controller));
  router.get("/:id", validParams(UUIDParamSchema), controller.findById.bind(controller));
  router.put(
    "/:id",
    adminMiddleware,
    validParams(UUIDParamSchema),
    validSchema(UpdateCanalSchema),
    controller.update.bind(controller),
  );
  router.delete("/:id", adminMiddleware, validParams(UUIDParamSchema), controller.delete.bind(controller));

  return router;
}
