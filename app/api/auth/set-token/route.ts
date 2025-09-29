import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 400 });
  }

  const res = NextResponse.json({ success: true });

  // Store accessToken in cookie
  res.cookies.set("token", token, {
    httpOnly: false, // ❌ make true if you don’t need to read it client-side
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res;
}
