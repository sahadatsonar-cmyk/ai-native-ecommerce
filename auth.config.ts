import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [],
  // Middleware-specific logic moved to middleware.ts using full auth()
} satisfies NextAuthConfig;
