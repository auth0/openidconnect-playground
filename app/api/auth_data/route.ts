import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import signature from "cookie-signature";
import crypto from "crypto";

export async function GET() {
  const secret = process.env.JWT_SECRET ?? "";
  const cookieStore = await cookies();
  const refreshValue = cookieStore.get("refresh")?.value;
  const authCodeValue = cookieStore.get("authCode")?.value;
  const refresh =
    refreshValue && refreshValue.startsWith("s:")
      ? signature.unsign(refreshValue.slice(2), secret)
      : null;
  const authCode =
    authCodeValue && authCodeValue.startsWith("s:")
      ? signature.unsign(authCodeValue.slice(2), secret)
      : null;

  let code = null;
  if (refresh === "false" && authCode) {
    code = authCode;
    cookieStore.set("refresh", "true", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
  }

  const state = crypto.randomBytes(20).toString("hex");
  return NextResponse.json({
    redirect_uri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    state,
    code,
  });
}
