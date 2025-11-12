const crypto = require("crypto");
const cookie = require("cookie");
const signature = require("cookie-signature");

export default function handler(req, res) {
  const secret = process.env.JWT_SECRET;
  const cookies = cookie.parse(req.headers.cookie || "");
  const refresh = cookies.refresh?.startsWith("s:")
    ? signature.unsign(cookies.refresh.slice(2), secret)
    : null;
  const authCode = cookies.authCode?.startsWith("s:")
    ? signature.unsign(cookies.authCode.slice(2), secret)
    : null;
  let code = null;
  if (refresh === "false" && authCode) {
    code = authCode;
    res.setHeader("Set-Cookie", [
      cookie.serialize("refresh", "true", {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "Lax",
      }),
    ]);
  }
  const state = crypto.randomBytes(20).toString("hex");
  res.status(200).json({
    redirect_uri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    state,
    code,
  });
}
