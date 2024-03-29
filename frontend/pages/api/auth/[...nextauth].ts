import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import LineProvider from "next-auth/providers/line";
import axios, { AxiosResponse } from "axios";
import {
  LoginFormInterface,
  RefreshTokenInterface,
  SessionAuthInterface,
} from "@interfaces/cmsInterfaces";
import { axiosClient } from "@lib/axios-client";
import { JWT } from "next-auth/jwt/types";
import consoleRender from "@helpers/console-helper";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

async function refreshAccessToken(tokenObject: JWT) {
  if (!tokenObject.refresh_token) {
    return { error: "Refresh Token is Null" };
  }

  try {
    const tokenRes = await axiosClient.post(
      `${BACKEND_API_URL}/api/auth/token/refresh/`,
      {
        refresh: tokenObject.refresh_token,
      }
    );

    const tokenData: RefreshTokenInterface = tokenRes.data;

    const userRes = await axiosClient.get(`${BACKEND_API_URL}/api/auth/user/`, {
      headers: { Authorization: `JWT ${tokenData.access}` },
    });

    return {
      ...tokenObject,
      user: userRes.data,
      access_token: tokenData.access,
      access_token_expiration: tokenData.access_token_expiration,
    };
  } catch (error) {
    return {
      error: "Refresh Token Error",
    };
  }
}

async function handleLogin(loginFormData: LoginFormInterface) {
  const res = await axiosClient
    .post(`${BACKEND_API_URL}/api/auth/login/?process=connect`, loginFormData)
    .catch((_) => {
      throw new Error("ログインに失敗しました。");
    });
  if (res.status === 200) {
    return res.data;
  } else {
    throw new Error("ログインに失敗しました。");
  }
}

export const authOptions: NextAuthOptions = {
  //   debug: process.env.DEBUG === "true",
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      id: "credential",
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, _) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (!email || !password) {
          throw new Error("login error");
        }
        const loginFormData: LoginFormInterface = {
          email: email.toLowerCase(),
          password: password,
        };

        const user = await handleLogin(loginFormData);
        if (user) {
          return user;
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY ?? "clientId",
      clientSecret:
        process.env.SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET ?? "clientSecret",
    }),
    LineProvider({
      clientId: process.env.SOCIAL_AUTH_LINE_CLIENT_ID ?? "clientId",
      clientSecret:
        process.env.SOCIAL_AUTH_LINE_CLIENT_SECRET ?? "clientSecret",
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET ?? "NEXTAUTH_SECRET",
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider === "credential") {
        return true;
      }
      if (account?.provider === "google") {
        try {
          const res: AxiosResponse = await axios.post(
            `${BACKEND_API_URL}/api/auth/google/?process=connect`,
            {
              access_token: account.access_token,
              id_token: account.id_token,
            }
          );
          if (res.status === 200 || res.status === 201) {
            const data: SessionAuthInterface = res.data;
            user.user = data.user;
            user.access_token = data.access_token;
            user.refresh_token = data.refresh_token;
            user.access_token_expiration = data.access_token_expiration;
            user.refresh_token_expiration = data.refresh_token_expiration;
            return true;
          }
          console.error("signin error", res.status);
          return false;
        } catch (error) {
          console.error(error);
          return false;
        }
      }

      if (account?.provider === "line") {
        try {
          const res: AxiosResponse = await axios.post(
            `${BACKEND_API_URL}/api/auth/line/?process=connect`,
            {
              access_token: account.access_token,
              id_token: account.id_token,
            }
          );
          if (res.status === 200 || res.status === 201) {
            const data: SessionAuthInterface = res.data;
            user.user = data.user;
            user.access_token = data.access_token;
            user.refresh_token = data.refresh_token;
            user.access_token_expiration = data.access_token_expiration;
            user.refresh_token_expiration = data.refresh_token_expiration;
            return true;
          }
          console.error("signin error", res.status);
          return false;
        } catch (error) {
          console.error(error);
          return false;
        }
      }

      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.access_token = user.access_token;
        token.access_token_expiration = user.access_token_expiration;
        token.refresh_token = user.refresh_token;
        token.refresh_token_expiration = user.refresh_token_expiration;
        token.user = user.user;
      }
      const shouldRefreshTime: number = Math.round(
        Date.parse(token.access_token_expiration!) - Date.now() - 60 * 59 * 1000
      );

      //   if (!!process.env.DEBUG) {
      //     return refreshAccessToken(token);
      //   }
      if (shouldRefreshTime < 0) {
        // TOKEN有効期限が満了したらリフレッシュ
        return refreshAccessToken(token);
      }

      return token;
    },
    async session({ session, token }) {
      session.access_token = token.access_token;
      session.access_token_expiration = token.access_token_expiration;
      session.refresh_token = token.refresh_token;
      session.refresh_token_expiration = token.refresh_token_expiration;
      session.user = token.user;

      return session;
    },
  },
};

export default NextAuth(authOptions);
