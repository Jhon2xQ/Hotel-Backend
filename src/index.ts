import { Hono } from "hono";
import { corsConfig } from "./common/configs/cors.config";
import { auth } from "./common/libraries/auth";

const app = new Hono();

app.use("/api/*", corsConfig);

app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

export default app;
