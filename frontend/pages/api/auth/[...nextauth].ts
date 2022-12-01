import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { NextApiRequest } from "next/types";
import { JWT } from "next-auth/jwt";

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
async function handleLogin(loginFormData: LoginFormData) {
  return await axios
    .post(`${API_URL}/api/user/token/`, loginFormData)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
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
          email: email,
          password: password,
        };

        const user = await handleLogin(loginFormData);
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, user, token }) {
      return session;
    },
    async jwt({ token, user }) {
      return token;
    },
  },
});
