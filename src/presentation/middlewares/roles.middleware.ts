import { createMiddleware } from "hono/factory";
import { ROLES } from "../../common/constants/roles";

export const requireRoles = (...allowedRoles: string[]) =>
  createMiddleware(async (c, next) => {
    const user = c.get("user") as { role?: string };
    const userRoles = user?.role?.split(",") ?? [];

    const isAdmin = userRoles.includes(ROLES.ADMIN);
    const hasRole = isAdmin || userRoles.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      return c.json({ message: "Acceso prohibido" }, 403);
    }

    await next();
  });
