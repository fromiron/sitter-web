import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import { NextApiRequest } from "next/types";
import { signIn } from "next-auth/react";

const API_URL = process.env.BACKEND_API_URL ?? "http://backend:8000";

interface LoginFormData {
  email: string;
  password: string;
}
interface User {
  id: string;
  name: string;
  email: string;
  access_token: string;
}

interface GoogleToken {
  accessToken: string;
  idToken: string;
}

async function handleLogin(loginFormData: LoginFormData) {
  return await axios
    .post(`${API_URL}/api/user/token/`, loginFormData)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw new Error("ログインに失敗しました。");
    });
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: "email-password-credential",
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<any, any>, req: NextApiRequest) {
        const { email, password } = credentials;

        if (email === undefined || password.length < 8) {
          throw new Error("login error");
        }
        const loginFormData: LoginFormData = {
          email: email.toLowerCase(),
          password: password,
        };

        const user = await handleLogin(loginFormData);
        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async signIn(user, account, profile) {
      if (account?.provider === "google") {
        const { accessToken, idToken } = account;
        try {
          const res = await axios.post(`${API_URL}/api/social/login/google/`, {
            access_token: accessToken,
            id_token: idToken,
          });
          const { access_token } = res.data;
          user.accessToken = access_token;
          return true;
        } catch (error) {
          return false;
        }
      } else {
        if (user) {
          return true;
        }
      }

      return false;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = user.access_token;
        console.log(`account:${JSON.stringify(user)}`);
      }
      return token;
    },
  },
  logger: {
    error(code, metadata) {
      console.log("=========error=======");
      console.error(code, metadata);
    },
    warn(code) {
      console.log("=========warn=======");
      console.warn(code);
    },
    debug(code, metadata) {
      console.log("=========debug=======");
      console.debug(code, metadata);
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: true,
});
