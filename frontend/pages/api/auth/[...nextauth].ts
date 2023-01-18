import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import { SessionAuthInterface } from "@interfaces/cmsInterfaces";
import { axiosClient } from "@lib/axios-client";
import { signOut } from "next-auth/react";
import { JWT } from "next-auth/jwt/types";

interface LoginFormData {
  email: string;
  password?: string;
}

const BACKEND_API_URL = process.env.BACKEND_API_URL;

async function refreshAccessToken(tokenObject: JWT) {
  try {
    const tokenResponse = await axios.post(
      "http://localhost:3000/server/api/auth/token/refresh",
      {
        refresh: tokenObject.refresh_token,
      }
    );

    return {
      ...tokenObject,
      accessToken: tokenResponse.data.accessToken,
      accessTokenExpiry: tokenResponse.data.accessTokenExpiry,
      refreshToken: tokenResponse.data.refreshToken,
    };
  } catch (error) {
    return {
      ...tokenObject,
      error: "RefreshAccessTokenError",
    };
  }
}

async function handleLogin(loginFormData: LoginFormData) {
  console.log(loginFormData);

  const res = await axiosClient
    .post(`${BACKEND_API_URL}/api/auth/login/`, loginFormData)
    .catch((error) => {
      console.log(error);

      throw new Error("ログインに失敗しました。");
    });

  console.log("res");

  if (res.status === 200) {
    return res.data;
  }
  throw new Error("ログインに失敗しました。");
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
        const loginFormData: LoginFormData = {
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
  ],
  secret: process.env.NEXTAUTH_SECRET ?? "NEXTAUTH_SECRET",
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider === "credential") {
        return true;
      }
      if (account?.provider === "google") {
        try {
          const res: any = await axios
            .post(`${BACKEND_API_URL}/api/auth/google/`, {
              access_token: account.access_token,
              id_token: account.id_token,
            })
            .catch((error) => console.log(error));

          if (res.status === 200 || res.status === 201) {
            const data: SessionAuthInterface = res.data;
            user.user = data.user;
            user.access_token = data.access_token;
            user.access_token_expiration = data.access_token_expiration;
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
        token.user = user.user;
      }

      //   if (token.access_token && token.access_token_expiration) {
      //     if (Date.now() > Date.parse(token.access_token_expiration)) {
      //       // TOKEN有効期限が満了したらリフレッシュ
      //       console.log("signout");

      //       await signOut();
      //     }
      //   }

      return token;
    },
    async session({ session, token }) {
      session.access_token = token.access_token;
      session.access_token_expiration = token.access_token_expiration;
      session.user = token.user;

      return session;
    },
  },
};

export default NextAuth(authOptions);
