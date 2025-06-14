export const roleUser = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
};

export type RoleUser = (typeof roleUser)[keyof typeof roleUser];
