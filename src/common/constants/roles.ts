export const ROLES = {
  ADMIN: "admin",
  RECEPCIONISTA: "recepcionista",
  SIN_ACCESO: "sin_acceso",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
