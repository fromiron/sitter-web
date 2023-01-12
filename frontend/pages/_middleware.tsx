import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const exceptions = ["/", "/auth", "/api/auth"];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  
  const { pathname } = req.nextUrl;
  const url = req.nextUrl.clone();

  // ログイン後にAuthにアクセスするとダッシュボードにリダイレクト
  if (token && pathname === "/auth") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // 未ログイン時は他のURLへの接続をログイン画面にリダイレクト（exceptionsを除き）
  if (
    !token &&
    exceptions.every((exRoute: string) => !pathname.includes(exRoute))
  ) {
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  // Allow if there is auth request or user has token
  if (token) return NextResponse.next();
}
