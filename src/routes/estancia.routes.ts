import { Hono } from "hono";
import { AppHono, AppVariables } from "../common/types/app.types";
import { PrismaClient } from "../../generated/prisma/client";
import { EstanciaRepository } from "../infrastructure/repositories/estancia.repository";
import { CreateEstanciaUseCase } from "../application/use-cases/estancia/create-estancia.use-case";
import { ListEstanciaUseCase } from "../application/use-cases/estancia/list-estancia.use-case";
import { FindEstanciaByIdUseCase } from "../application/use-cases/estancia/find-estancia-by-id.use-case";
import { UpdateEstanciaUseCase } from "../application/use-cases/estancia/update-estancia.use-case";
import { DeleteEstanciaUseCase } from "../application/use-cases/estancia/delete-estancia.use-case";
import { CheckoutEstanciaUseCase } from "../application/use-cases/estancia/checkout-estancia.use-case";
import { EstanciaController } from "../presentation/controllers/estancia.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { adminMiddleware } from "../presentation/middlewares/admin.middleware";
import { validSchema } from "../presentation/middlewares/valid.middleware";
import {
  CreateEstanciaSchema,
  UpdateEstanciaSchema,
  CheckoutEstanciaSchema,
} from "../presentation/schemas/estancia.schema";

export function createEstanciaRoutes(prismaClient: PrismaClient): AppHono {
  const repository = new EstanciaRepository(prismaClient);
  const createUseCase = new CreateEstanciaUseCase(repository);
  const listUseCase = new ListEstanciaUseCase(repository);
  const findByIdUseCase = new FindEstanciaByIdUseCase(repository);
  const updateUseCase = new UpdateEstanciaUseCase(repository);
  const deleteUseCase = new DeleteEstanciaUseCase(repository);
  const checkoutUseCase = new CheckoutEstanciaUseCase(repository);

  const controller = new EstanciaController(
    createUseCase,
    listUseCase,
    findByIdUseCase,
    updateUseCase,
    deleteUseCase,
    checkoutUseCase,
  );

  const router = new Hono<{ Variables: AppVariables }>();

  router.use("*", authMiddleware);

  router.get("/", controller.list.bind(controller));
  router.get("/:id", controller.findById.bind(controller));
  router.post("/", adminMiddleware, validSchema(CreateEstanciaSchema), controller.create.bind(controller));
  router.put("/:id", adminMiddleware, validSchema(UpdateEstanciaSchema), controller.update.bind(controller));
  router.delete("/:id", adminMiddleware, controller.delete.bind(controller));
  router.patch(
    "/:id/checkout",
    adminMiddleware,
    validSchema(CheckoutEstanciaSchema),
    controller.checkout.bind(controller),
  );

  return router;
}
