export const ROLES = {
  ADMIN: "ADMIN",
  RECEPCIONISTA: "RECEPCIONISTA",
  SIN_ACCESO: "SIN_ACCESO",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
