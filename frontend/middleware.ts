import consoleRender from "@lib/console-helper";
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: async ({ token }) => {
      //   const res = await fetch("http://localhost:3000/api/auth/me", {
      //     body: JSON.stringify({ token: token?.access_token }),
      //     method: "POST",
      //   });
      //   consoleRender("[middleware] res", res);
      return true;
    },
  },
});
export const config = {
  matcher: ["/admin/customers", "/admin/pets"],
};
