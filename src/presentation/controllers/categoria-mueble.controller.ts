import { injectable } from "tsyringe";
import { CreateCategoriaMuebleUseCase } from "../../application/use-cases/categoria-mueble/create-categoria-mueble.use-case";
import { DeleteCategoriaMuebleUseCase } from "../../application/use-cases/categoria-mueble/delete-categoria-mueble.use-case";
import { FindCategoriaMuebleUseCase } from "../../application/use-cases/categoria-mueble/find-categoria-mueble-by-id.use-case";
import { ListCategoriaMuebleUseCase } from "../../application/use-cases/categoria-mueble/list-categoria-mueble.use-case";
import { UpdateCategoriaMuebleUseCase } from "../../application/use-cases/categoria-mueble/update-categoria-mueble.use-case";
import { AppContext } from "../../common/types/app.types";
import { ApiResponse } from "../api.response";

@injectable()
export class CategoriaMuebleController {
    constructor(
        private readonly createUseCase: CreateCategoriaMuebleUseCase,
        private readonly listUseCase: ListCategoriaMuebleUseCase,
        private readonly findByIdUseCase: FindCategoriaMuebleUseCase,
        private readonly updateUseCase: UpdateCategoriaMuebleUseCase,
        private readonly deleteUseCase: DeleteCategoriaMuebleUseCase,
    ) {}

    async create(c: AppContext) {
        const validData = c.get("validData") as {
            nombre: string;
            descripcion?: string;
        };

        const categoriaMueble = await this.createUseCase.execute({
            nombre: validData.nombre,
            descripcion: validData.descripcion,
        });

        return c.json(
            ApiResponse.success("Categoría de mueble creada exitosamente", categoriaMueble.toOutput()),
            201,
        );
    }

    async list(c: AppContext) {
        const categorias = await this.listUseCase.execute();
        const output = categorias.map((cm) => cm.toOutput());
        return c.json(ApiResponse.success("Categorías de mueble obtenidas exitosamente", output), 200);
    }

    async findById(c: AppContext) {
        const id = c.req.param("id") as string;
        const categoriaMueble = await this.findByIdUseCase.execute(id);
        return c.json(ApiResponse.success("Categoría de mueble encontrada", categoriaMueble.toOutput()), 200);
    }

    async update(c: AppContext) {
        const id = c.req.param("id") as string;
        const validData = c.get("validData") as {
            nombre?: string;
            descripcion?: string;
        };

        const updatedCategoriaMueble = await this.updateUseCase.execute(id, {
            nombre: validData.nombre,
            descripcion: validData.descripcion,
        });

        return c.json(ApiResponse.success("Categoría de mueble actualizada exitosamente", updatedCategoriaMueble.toOutput()), 200);
    }

    async delete(c: AppContext) {
        const id = c.req.param("id") as string;
        await this.deleteUseCase.execute(id);
        return c.json(ApiResponse.success("Categoría de mueble eliminada exitosamente"), 200);
    }
}