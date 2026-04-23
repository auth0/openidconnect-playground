import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const authCode = cookieStore.get("authCode");
  const refresh = cookieStore.get("refresh");

  if (!refresh && authCode) {
    cookieStore.set("refresh", "true", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
  }

  return NextResponse.redirect(new URL("/", request.url), { status: 302 });
}
