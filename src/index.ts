import "reflect-metadata";
import { Hono } from "hono";
import { corsConfig } from "./common/configs/cors.config";
import { registerDependencies } from "./common/IoC/container";
import { auth } from "./common/libraries/auth";
import { prisma } from "./common/libraries/prisma";
import { createHabitacionRoutes, createHabitacionPublicRoutes } from "./routes/habitacion.routes";
import { createTipoHabitacionRoutes, createTipoHabitacionPublicRoutes } from "./routes/tipo-habitacion.routes";
import { createPagoRoutes } from "./routes/pago.routes";
import { createHuespedRoutes } from "./routes/huesped.routes";
import { createCanalRoutes } from "./routes/canal.routes";
import { createTarifaRoutes } from "./routes/tarifa.routes";
import { createReservaRoutes } from "./routes/reserva.routes";
import { createEstanciaRoutes } from "./routes/estancia.routes";
import { createMuebleRoutes } from "./routes/mueble.routes";
import { createCategoriaMuebleRoutes } from "./routes/categoria-mueble.routes";
import { createPromocionRoutes } from "./routes/promocion.routes";
import { createProductoRoutes } from "./routes/producto.routes";
import { createFolioRoutes } from "./routes/folio.routes";
import { errorHandler } from "./presentation/middlewares/exception.middleware";
import { authMiddleware } from "./presentation/middlewares/auth.middleware";

registerDependencies(prisma);

const app = new Hono();

app.use("/api/*", corsConfig);

//health-check-------------------------------------------------------------------------------
app.get("/api/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

//better-auth----------------------------------------------------------
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

//RUTAS-PUBLICAS______________________________________________________
const publicApi = new Hono();
publicApi.route("/habitaciones", createHabitacionPublicRoutes());
publicApi.route("/tipos-habitacion", createTipoHabitacionPublicRoutes());

//RUTAS-PRIVADAS______________________________________________________
const privateApi = new Hono();
//privateApi.use("*", authMiddleware);
privateApi.route("/habitaciones", createHabitacionRoutes());
privateApi.route("/categorias-mueble", createCategoriaMuebleRoutes());
privateApi.route("/muebles", createMuebleRoutes());
privateApi.route("/tipos-habitacion", createTipoHabitacionRoutes());
privateApi.route("/reservas", createReservaRoutes());
privateApi.route("/huespedes", createHuespedRoutes());
privateApi.route("/estancias", createEstanciaRoutes());
privateApi.route("/pagos", createPagoRoutes());
privateApi.route("/canales", createCanalRoutes());
privateApi.route("/tarifas", createTarifaRoutes());
privateApi.route("/promociones", createPromocionRoutes());
privateApi.route("/productos", createProductoRoutes());
privateApi.route("/folios", createFolioRoutes());

app.route("/api/public", publicApi);
app.route("/api/private", privateApi);

app.onError(errorHandler);

export default app;
