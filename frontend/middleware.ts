import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: async ({ token }) => {
      if (token?.user?.is_active && token?.user.is_staff) {
        return true;
      }
      return false;
    },
  },
});
export const config = {
  matcher: ["/admin/customer", "/admin/pet"],
};
