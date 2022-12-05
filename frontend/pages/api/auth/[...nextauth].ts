import NextAuth, { NextAuthOptions, RequestInternal, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

const API_URL = "http://backend:8000";

interface LoginFormData {
  email: string;
  password: string;
}

function showLog(location: string, log: any) {
  console.log(`================${location}=========================`);
  console.log(log);
  console.log(`==================================================`);
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
        const { email, password } = credentials;
        if (email === undefined || password.length < 8) {
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
  secret: "SECRET_KEY",
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credential") {
        return true;
      }
      if (account?.provider === "google") {
        try {
          const res: any = await axios
            .post(`${API_URL}/api/social/google/`, {
              access_token: account.access_token,
              id_token: account.id_token,
            })
            .catch((error) => console.log(error));

          if (res.status === 200 || res.status === 201) {
            const data = res.data;
            user.accessToken = data.access_token;
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
    async jwt({ token, account, user }) {
      if (account && account.provider === "credential") {
        showLog("jwt token", token);
        showLog("jwt account", token);
        showLog("jwt user", user);

        if (user) {
          const { access_token, user: tokenUser } = user;
          token.user = tokenUser;
          token.accessToken = access_token;
        }
        token.provider = "credential";
      }
      if (account && account.provider === "google") {
        const { accessToken } = user;
        token.provider = "google";
        token.user = account.user;
        token.accessToken = accessToken;
      }

      showLog("jwt final", token);

      return token;
    },
    async session({ session, token }) {
      if (token.provider === "credential") {
        session.user = token.user;
      }
      session.accessToken = token.accessToken;

      return session;
    },
  },
};

export default NextAuth(authOptions);
