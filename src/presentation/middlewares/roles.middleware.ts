import { createMiddleware } from "hono/factory";
import { ROLES } from "../../common/constants/roles";
import { ApiResponse } from "../api.response";

export const requireRoles = (...allowedRoles: string[]) =>
  createMiddleware(async (c, next) => {
    const user = c.get("user") as { role?: string };
    const userRoles = user?.role?.split(",") ?? [];

    const isAdmin = userRoles.includes(ROLES.ADMIN);
    const hasRole = isAdmin || userRoles.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      return c.json(ApiResponse.error("Acceso prohibido"), 403);
    }

    await next();
  });
