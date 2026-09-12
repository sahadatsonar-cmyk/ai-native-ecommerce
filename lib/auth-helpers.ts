import { auth } from "@/auth";
import type { Permission, Role } from "@/types/auth";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireRole(allowedRoles: Role[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden");
  }
  return user;
}

export async function requirePermission(permission: Permission) {
  const user = await requireAuth();
  if (!user.permissions.includes(permission)) {
    throw new Error("Forbidden");
  }
  return user;
}

export function hasPermission(
  userPermissions: Permission[],
  permission: Permission
) {
  return userPermissions.includes(permission);
}
