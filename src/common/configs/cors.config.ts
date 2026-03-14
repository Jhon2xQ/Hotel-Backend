import { cors } from "hono/cors";
import { TRUSTED_ORIGINS } from "./env.config";

export const corsConfig = cors({
  origin: TRUSTED_ORIGINS,
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
});
