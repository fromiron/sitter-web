import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import consoleRender from "./lib/console-helper";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
export default withAuth({
  callbacks: {
    authorized: async ({ req, token }) => {
      const session = await getToken({ req });
      console.log("authorized", token, session);
      return true;
    },
  },
});
export const config = {
  matcher: ["/admin/customers", "/admin/pets"],
};
