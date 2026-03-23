import { Hono } from "hono";
import { corsConfig } from "./common/configs/cors.config";
import { auth } from "./common/libraries/auth";
import { prisma } from "./common/libraries/prisma";
import { createMuebleRoutes } from "./routes/mueble.routes";
import { createTipoHabitacionRoutes } from "./routes/tipo-habitacion.routes";
import { createHabitacionRoutes } from "./routes/habitacion.routes";
import { createPagoRoutes } from "./routes/pago.routes";
import { createHuespedRoutes } from "./routes/huesped.routes";
import { errorHandler } from "./presentation/middlewares/exception.middleware";
import { categoriaMuebleRoutes } from "./routes/categoria-mueble.routes";

const app = new Hono();

app.use("/api/*", corsConfig);

app.get("/api/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.route("/api/muebles", createMuebleRoutes(prisma));
app.route("/api/tipos-habitacion", createTipoHabitacionRoutes(prisma));
app.route("/api/habitaciones", createHabitacionRoutes(prisma));
app.route("/api/pagos", createPagoRoutes(prisma));
app.route("/api/huespedes", createHuespedRoutes(prisma));
app.route("/api/categorias-mueble", categoriaMuebleRoutes(prisma));

app.onError(errorHandler);

export default app;
