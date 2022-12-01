import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { NextApiRequest } from "next/types";

const API_URL = process.env.BACKEND_API_URL ?? "http://backend:8000";

interface LoginFormData {
  email: string;
  password: string;
}
async function getToken(loginFormData: LoginFormData) {
  return await axios
    .post(`${API_URL}/api/user/token/`, loginFormData)
    .then((response) => {
      return response.data.token;
    })
    .catch((error) => {
      console.log(error);
      throw new Error("ログインに失敗しました。");
    });
}
async function getMe(token: string) {
  return await axios
    .get(`${API_URL}/api/user/me/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then((response) => {
      return response.data;
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

        const token = await getToken(loginFormData);
        const me = await getMe(token);

        console.log(me);

        return me;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});
