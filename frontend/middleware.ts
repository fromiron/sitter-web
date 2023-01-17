import withAuth from "next-auth/middleware";
import consoleRender from "@lib/console-helper";

export default withAuth({
  callbacks: {
    async authorized({ token }) {
      if (token?.user?.is_active && token?.user?.is_staff) {
        consoleRender("authorized");
        return true;
      } else {
        return false;
      }
    },
  },
});

export const config = { matcher: ["/admin/customers"] };
