import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [], // Providers are configured in auth.ts to avoid Edge runtime issues with Prisma
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isPublicPath = [
        "/", 
        "/login", 
        "/register", 
        "/forgot-password", 
        "/reset-password",
        "/pricing",
        "/about"
      ].includes(nextUrl.pathname) || nextUrl.pathname.startsWith("/api/");

      if (isOnAdmin) {
        if (isLoggedIn) {
          const role = (auth.user as any)?.role;
          if (role !== "super_admin" && role !== "admin") {
            return Response.redirect(new URL("/dashboard", nextUrl));
          }
          return true;
        }
        return false; // Redirect to /login
      }

      // If it's not a public path and user is not logged in, redirect to login
      if (!isPublicPath && !isLoggedIn) {
        return false; 
      }

      // If user is logged in and trying to access auth pages, redirect to dashboard
      const isAuthPage = ["/login", "/register", "/forgot-password", "/reset-password"].includes(nextUrl.pathname);
      if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        (session.user as any).role = token.role as string;
        (session.user as any).tenantId = token.tenantId as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.tenantId = (user as any).tenantId;
      }
      return token;
    },
  },
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
