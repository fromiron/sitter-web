import NextAuth, { Account, NextAuthOptions } from "next-auth";
import CredentialsProvider, {
  CredentialInput,
} from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import { JWT } from "next-auth/jwt/types";
const API_URL = "http://backend:8000";

interface LoginFormData {
  email: string;
  password?: string;
}

async function handleLogin(loginFormData: LoginFormData) {
  const res = await axios
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
  secret: process.env.JWT_SECRET ?? "JWT_SECRET",
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({
      account,
      profile,
    }: {
      account: Account | null;
      profile?: any;
    }) {
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
            const data = res.data;
            for (const key in data) {
              profile[key] = data[key];
            }
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
    async jwt({ token, profile }: { token: JWT; profile?: any }) {
      if (profile) {
        token = {};
        for (const key in profile) {
          token[key] = profile[key];
        }
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      session = {};
      for (const key in token) {
        session[key] = token[key];
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
