import { NextResponse, NextRequest } from "next/server";
import signature from "cookie-signature";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (code) {
    const secret = process.env.JWT_SECRET;
    const cookieStore = await cookies();
    const signedRefresh = "s:" + signature.sign("false", secret);
    const signedAuthCode = "s:" + signature.sign(code, secret);
    cookieStore.set("authCode", signedAuthCode, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
    cookieStore.set("refresh", signedRefresh, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
    });
    return NextResponse.redirect("/", { status: 302 });
  } else {
    return NextResponse.json(
      { message: 'Bad Request: Missing required parameter "code"' },
      { status: 400 },
    );
  }
}
