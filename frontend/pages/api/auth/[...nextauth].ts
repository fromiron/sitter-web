import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import { SessionAuthInterface } from "@interfaces/cmsInterfaces";
import { axiosClient } from "@lib/axios-client";
const API_URL = "http://backend:8000";

interface LoginFormData {
  email: string;
  password?: string;
}

async function handleLogin(loginFormData: LoginFormData) {
  const res = await axiosClient
    .post(`${API_URL}/api/auth/login/`, loginFormData)
    .catch((error) => {
      throw new Error("ログインに失敗しました。");
    });

  if (res.status === 200) {
    return res.data;
  }
  throw new Error("ログインに失敗しました。");
}

export const authOptions: NextAuthOptions = {
  debug: process.env.DEBUG === "true",
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
            .post(`${API_URL}/api/auth/google/`, {
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
