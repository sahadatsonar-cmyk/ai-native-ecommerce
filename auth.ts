import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { authConfig } from "./auth.config";
import type { Role, Permission } from "./types/auth";

// Temporary in-memory users for Phase 05
// Will be replaced by database in later phases
const DEMO_USERS = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Platform Admin",
    password: "admin123",
    role: "admin" as Role,
    permissions: [
      "products.read",
      "products.create",
      "products.update",
      "products.delete",
      "orders.read",
      "orders.update",
      "inventory.read",
      "inventory.update",
      "customers.read",
      "analytics.read",
      "ai.copilot.use",
      "ai.product.generate",
      "marketing.manage",
      "settings.manage",
    ] as Permission[],
    storeId: "store_1",
  },
  {
    id: "2",
    email: "customer@example.com",
    name: "Demo Customer",
    password: "customer123",
    role: "customer" as Role,
    permissions: [] as Permission[],
    storeId: null,
  },
];

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = DEMO_USERS.find(
          (u) => u.email === email && u.password === password
        );

        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          permissions: user.permissions,
          storeId: user.storeId,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.permissions = user.permissions;
        token.storeId = user.storeId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.permissions = token.permissions;
        session.user.storeId = token.storeId;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
