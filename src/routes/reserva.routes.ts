import { Hono } from "hono";
import { AppHono, AppVariables } from "../common/types/app.types";
import { PrismaClient } from "../../generated/prisma/client";
import { ReservaRepository } from "../infrastructure/repositories/reserva.repository";
import { CreateReservaUseCase } from "../application/use-cases/reserva/create-reserva.use-case";
import { ListReservaUseCase } from "../application/use-cases/reserva/list-reserva.use-case";
import { FindReservaByIdUseCase } from "../application/use-cases/reserva/find-reserva-by-id.use-case";
import { UpdateReservaUseCase } from "../application/use-cases/reserva/update-reserva.use-case";
import { DeleteReservaUseCase } from "../application/use-cases/reserva/delete-reserva.use-case";
import { CancelReservaUseCase } from "../application/use-cases/reserva/cancel-reserva.use-case";
import { UpdateEstadoReservaUseCase } from "../application/use-cases/reserva/update-estado-reserva.use-case";
import { ReservaController } from "../presentation/controllers/reserva.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { adminMiddleware } from "../presentation/middlewares/admin.middleware";
import { validSchema } from "../presentation/middlewares/valid.middleware";
import {
  CreateReservaSchema,
  UpdateReservaSchema,
  CancelReservaSchema,
  UpdateEstadoReservaSchema,
} from "../presentation/schemas/reserva.schema";

export function createReservaRoutes(prismaClient: PrismaClient): AppHono {
  const repository = new ReservaRepository(prismaClient);
  const createUseCase = new CreateReservaUseCase(repository);
  const listUseCase = new ListReservaUseCase(repository);
  const findByIdUseCase = new FindReservaByIdUseCase(repository);
  const updateUseCase = new UpdateReservaUseCase(repository);
  const deleteUseCase = new DeleteReservaUseCase(repository);
  const cancelUseCase = new CancelReservaUseCase(repository);
  const updateEstadoUseCase = new UpdateEstadoReservaUseCase(repository);

  const controller = new ReservaController(
    createUseCase,
    listUseCase,
    findByIdUseCase,
    updateUseCase,
    deleteUseCase,
    cancelUseCase,
    updateEstadoUseCase,
  );

  const router = new Hono<{ Variables: AppVariables }>();

  router.use("*", authMiddleware);

  router.get("/", controller.list.bind(controller));
  router.get("/:id", controller.findById.bind(controller));
  router.post("/", validSchema(CreateReservaSchema), controller.create.bind(controller));
  router.put("/:id", validSchema(UpdateReservaSchema), controller.update.bind(controller));
  router.delete("/:id", controller.delete.bind(controller));
  router.patch("/:id/cancel", validSchema(CancelReservaSchema), controller.cancel.bind(controller));
  router.patch(
    "/:id/estado",
    adminMiddleware,
    validSchema(UpdateEstadoReservaSchema),
    controller.updateEstado.bind(controller),
  );

  return router;
}
