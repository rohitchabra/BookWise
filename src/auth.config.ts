import type { NextAuthConfig } from "next-auth";

// Kept free of database and Node-only imports so it can be evaluated in the
// proxy, which runs before the application bundle is loaded.
export const authConfig = {
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  providers: [],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.status = (user as { status?: string }).status;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.status = token.status as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
