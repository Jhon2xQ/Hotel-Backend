import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "./prisma";
import { TRUSTED_ORIGINS } from "../configs/env.config";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: () => TRUSTED_ORIGINS.split(",").map((o) => o.trim()),
  advanced: {
    crossSubdomainCookies: {
      enabled: true,
    },
    cookiePrefix: "better-auth",
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      partitioned: true,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "PERSONAL",
        required: true,
      },
    },
  },
});
