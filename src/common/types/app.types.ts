import { Context, Hono } from "hono";
import { auth } from "../libraries/auth";

export type AppVariables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
  validData: unknown;
};

export type AppHono = Hono<{ Variables: AppVariables }>;
export type AppContext = Context<{ Variables: AppVariables }>;
