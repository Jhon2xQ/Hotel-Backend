import { Hono } from "hono";
import { PrismaClient } from "../../generated/prisma/client";
import { CreateCategoriaMuebleUseCase } from "../application/use-cases/categoria-mueble/create-categoria-mueble.use-case";
import { DeleteCategoriaMuebleUseCase } from "../application/use-cases/categoria-mueble/delete-categoria-mueble.use-case";
import { FindCategoriaMuebleUseCase } from "../application/use-cases/categoria-mueble/find-categoria-mueble-by-id.use-case";
import { ListCategoriaMuebleUseCase } from "../application/use-cases/categoria-mueble/list-categoria-mueble.use-case";
import { UpdateCategoriaMuebleUseCase } from "../application/use-cases/categoria-mueble/update-categoria-mueble.use-case";
import { AppHono, AppVariables } from "../common/types/app.types";
import { CategoriaMuebleRepository } from "../infrastructure/repositories/categoria-mueble.repository";
import { CategoriaMuebleController } from "../presentation/controllers/categoria-mueble.controller";
import { authMiddleware } from "../presentation/middlewares/auth.middleware";
import { validParams, validSchema } from "../presentation/middlewares/valid.middleware";
import { CategoriaMuebleIdSchema, CreateCategoriaMuebleSchema, UpdateCategoriaMuebleSchema } from "../presentation/schemas/categoria-mueble.schema";
import { adminMiddleware } from "../presentation/middlewares/admin.middleware";

export function categoriaMuebleRoutes(prismaClient: PrismaClient): AppHono {
    const repository = new CategoriaMuebleRepository(prismaClient);
    const createUseCase = new CreateCategoriaMuebleUseCase(repository);
    const listUseCase = new ListCategoriaMuebleUseCase(repository);
    const findByIdUseCase = new FindCategoriaMuebleUseCase(repository);
    const updateUseCase = new UpdateCategoriaMuebleUseCase(repository);
    const deleteUseCase = new DeleteCategoriaMuebleUseCase(repository);

    const controller = new CategoriaMuebleController(
        createUseCase,
        listUseCase,
        findByIdUseCase,
        updateUseCase,
        deleteUseCase,
    );

    const router = new Hono<{ Variables: AppVariables }>();

    router.use("*", authMiddleware);

    router.get("/", adminMiddleware, controller.list.bind(controller));
    router.get("/:id", adminMiddleware, validParams(CategoriaMuebleIdSchema), controller.findById.bind(controller));
    router.post("/", adminMiddleware, validSchema(CreateCategoriaMuebleSchema), controller.create.bind(controller));
    router.put("/:id", adminMiddleware, validParams(CategoriaMuebleIdSchema), validSchema(UpdateCategoriaMuebleSchema), controller.update.bind(controller));
    router.delete("/:id", adminMiddleware, validParams(CategoriaMuebleIdSchema), controller.delete.bind(controller));

    return router;
}