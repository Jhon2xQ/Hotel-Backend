import { createMiddleware } from "hono/factory";
import { auth } from "../../common/libraries/auth";
import { ApiResponse } from "../api.response";

export const authMiddleware = createMiddleware(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json(ApiResponse.error("No autorizado"), 401);
  }

  c.set("user", session.user);
  c.set("session", session.session);
  await next();
});
