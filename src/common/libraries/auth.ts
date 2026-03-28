import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "./prisma";
import { TRUSTED_ORIGINS } from "../configs/env.config";
import { admin } from "better-auth/plugins";
import { ROLES } from "../constants/roles";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: () => TRUSTED_ORIGINS.split(",").map((o) => o.trim()),

  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      defaultRole: ROLES.ADMIN,
      adminRoles: [ROLES.ADMIN],
      bannedUserMessage: "Tu cuenta no tiene acceso al sistema",
    }),
  ],
});
