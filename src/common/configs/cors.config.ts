import { cors } from "hono/cors";
import { TRUSTED_ORIGINS } from "./env.config";

export const corsConfig = cors({
  origin: (origin) => {
    const allowed = TRUSTED_ORIGINS.split(",").map((o) => o.trim());
    return allowed.includes(origin) ? origin : null;
  },
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
});
