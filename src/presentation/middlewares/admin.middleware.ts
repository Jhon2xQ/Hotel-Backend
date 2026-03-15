import { Next } from "hono";
import { AppContext } from "../../common/types/app.types";
import { ApiResponse } from "../api.response";

export async function adminMiddleware(c: AppContext, next: Next) {
  const user = c.get("user");

  if (!user || user.role !== "ADMIN") {
    return c.json(ApiResponse.error("Acceso prohibido"), 403);
  }

  await next();
}
