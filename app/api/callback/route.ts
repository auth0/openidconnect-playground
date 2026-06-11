import { NextResponse, NextRequest } from "next/server";
import signature from "cookie-signature";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");
  if (code) {
    const secret = process.env.JWT_SECRET ?? "";
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
    const urlHomepage = new URL("/", request.url)
    return NextResponse.redirect(urlHomepage, { status: 302 });
  } else if (error) {
    const errorParams = new URLSearchParams({ error });
    const errorDescription =
      request.nextUrl.searchParams.get("error_description");
    if (errorDescription) {
      errorParams.set("error_description", errorDescription);
    }
    const urlHomepage = new URL(`/?${errorParams.toString()}`, request.url);
    return NextResponse.redirect(urlHomepage, { status: 302 });
  } else {
    return NextResponse.json(
      { message: 'Bad Request: Missing required parameter "code"' },
      { status: 400 },
    );
  }
}
