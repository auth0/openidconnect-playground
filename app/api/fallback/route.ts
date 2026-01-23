import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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

  const urlHomepage = new URL("/", request.url);
  return NextResponse.redirect(urlHomepage, { status: 302 });
}
