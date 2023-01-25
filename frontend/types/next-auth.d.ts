import NextAuth from "next-auth";
import { SessionAuthInterface } from "@interfaces/cmsInterfaces";
import { getSession, GetSessionParams } from "next-auth/react";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends SessionAuthInterface {
    user: UserInterface;
  }
  interface User extends SessionAuthInterface {}
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends SessionAuthInterface {}
}

declare module "next-auth/react" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends SessionAuthInterface {}
  interface User extends SessionAuthInterface {}
  export function getSession(
    params?: GetSessionParams
  ): Promise<SessionAuthInterface | null>;
}
