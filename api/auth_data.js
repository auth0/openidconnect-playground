const crypto = require("crypto");
const cookie = require("cookie")

export default function handler(req, res) {
    let code = null;
    if (req.cookies.refresh === "false" && req.cookies.authCode) {
        code = req.cookies.authCode;
        res.setHeader("Set-Cookie", [
            cookie.serialize("refresh", "true", {
                httpOnly: true,
                secure: true,
                path: "/",
                sameSite: "Lax"
            })
        ]);
    }
    const state = crypto.randomBytes(20).toString("hex")
    res.status(200).json({
        redirect_uri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        state,
        code
    })

}