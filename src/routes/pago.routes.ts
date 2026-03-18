import { Hono } from "hono";
import { AppHono, AppVariables } from "../common/types/app.types";
import { PrismaClient } from "../../generated/prisma/client";
import { PagoRepository } from "../infrastructure/repositories/pago.repository";
import { PersonalRepository } from "../infrastructure/repositories/personal.repository";
import { CreatePagoUseCase } from "../application/use-cases/pago/create-pago.use-case";
import { ListPagoUseCase } from "../application/use-cases/pago/list-pago.use-case";
import { FindPagoByIdUseCase } from "../application/use-cases/pago/find-pago-by-id.use-case";
import { UpdatePagoUseCase } from "../application/use-cases/pago/update-pago.use-case";
import { DeletePagoUseCase } from "../application/use-cases/pago/delete-pago.use-case";
import { PagoController } from "../presentation/controllers/pago.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { adminMiddleware } from "../presentation/middlewares/admin.middleware";
import { validSchema, validParams } from "../presentation/middlewares/valid.middleware";
import { CreatePagoSchema, UpdatePagoSchema } from "../presentation/schemas/pago.schema";
import { UUIDParamSchema } from "../presentation/schemas/tipo-habitacion.schema";

export function createPagoRoutes(prismaClient: PrismaClient): AppHono {
  const repository = new PagoRepository(prismaClient);
  const personalRepository = new PersonalRepository(prismaClient);

  const createUseCase = new CreatePagoUseCase(repository, personalRepository);
  const listUseCase = new ListPagoUseCase(repository);
  const findByIdUseCase = new FindPagoByIdUseCase(repository);
  const updateUseCase = new UpdatePagoUseCase(repository, personalRepository);
  const deleteUseCase = new DeletePagoUseCase(repository);

  const controller = new PagoController(createUseCase, listUseCase, findByIdUseCase, updateUseCase, deleteUseCase);

  const router = new Hono<{ Variables: AppVariables }>();

  router.use("*", authMiddleware);

  router.post("/", adminMiddleware, validSchema(CreatePagoSchema), controller.create.bind(controller));
  router.get("/", controller.list.bind(controller));
  router.get("/:id", validParams(UUIDParamSchema), controller.findById.bind(controller));
  router.put(
    "/:id",
    adminMiddleware,
    validParams(UUIDParamSchema),
    validSchema(UpdatePagoSchema),
    controller.update.bind(controller),
  );
  router.delete("/:id", adminMiddleware, validParams(UUIDParamSchema), controller.delete.bind(controller));

  return router;
}
