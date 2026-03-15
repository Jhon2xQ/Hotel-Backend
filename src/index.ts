import { Hono } from "hono";
import { corsConfig } from "./common/configs/cors.config";
import { auth } from "./common/libraries/auth";
import { prisma } from "./common/libraries/prisma";
import { createHabitationRoutes } from "./routes/habitation.routes";
import { errorHandler } from "./presentation/middlewares/exception.middleware";

const app = new Hono();

app.use("*", errorHandler);
app.use("/api/*", corsConfig);

app.get("/api/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.route("/api/habitaciones", createHabitationRoutes(prisma));

export default app;
