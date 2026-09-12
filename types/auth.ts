export type Role =
  | "super_admin"
  | "admin"
  | "manager"
  | "staff"
  | "customer";

export type Permission =
  | "products.read"
  | "products.create"
  | "products.update"
  | "products.delete"
  | "orders.read"
  | "orders.update"
  | "orders.cancel"
  | "inventory.read"
  | "inventory.update"
  | "customers.read"
  | "customers.update"
  | "analytics.read"
  | "ai.copilot.use"
  | "ai.product.generate"
  | "ai.support.use"
  | "marketing.manage"
  | "settings.manage"
  | "users.manage";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  permissions: Permission[];
  storeId?: string | null;
}

declare module "next-auth" {
  interface Session {
    user: AuthUser;
  }

  interface User {
    role: Role;
    permissions: Permission[];
    storeId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    permissions: Permission[];
    storeId?: string | null;
  }
}
