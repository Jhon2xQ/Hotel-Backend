import { Next } from "hono";
import { AppContext } from "../../common/types/app.types";
import { auth } from "../../common/libraries/auth";
import { ApiResponse } from "../api.response";

export async function authMiddleware(c: AppContext, next: Next) {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json(ApiResponse.error("No autorizado"), 401);
  }

  c.set("user", session.user);
  c.set("session", session.session);

  await next();
}
