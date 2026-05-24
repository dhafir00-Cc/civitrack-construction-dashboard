import { NextResponse } from "next/server";

import { AUTH_COOKIE, createSessionToken, verifyCredentials } from "@/lib/auth";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const isFormPost = contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data");
  const payload = isFormPost ? await request.formData() : await request.json().catch(() => null);
  const email = String(isFormPost ? payload.get("email") : payload?.email ?? "");
  const password = String(isFormPost ? payload.get("password") : payload?.password ?? "");
  const user = await verifyCredentials(email, password);

  if (!user) {
    if (isFormPost) {
      return NextResponse.redirect(new URL("/login?error=1", request.url), 303);
    }

    return NextResponse.json(
      { message: "Email atau kata sandi tidak valid." },
      { status: 401 }
    );
  }

  const response = isFormPost
    ? NextResponse.redirect(new URL("/dashboard", request.url), 303)
    : NextResponse.json({ user });
  response.cookies.set(AUTH_COOKIE, createSessionToken(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return response;
}
