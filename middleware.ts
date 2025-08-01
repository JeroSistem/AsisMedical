import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Aquí puedes agregar lógica adicional si es necesario
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/patients/:path*",
    "/historias/:path*",
    "/admin/:path*",
    "/triage/:path*",
    "/test-db",
  ],
}; 