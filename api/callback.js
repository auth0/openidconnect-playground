const cookie = require('cookie')

export default function handler(req,res) {
    if(req.method === "GET") {
        const { code } = req.query
        if(code) {
            res.setHeader("Set-Cookie", [
                cookie.serialize("authCode", code, {
                    httpOnly: true,
                    secure: true,
                    path: "/",
                    sameSite: "Lax"
                }),
                cookie.serialize("refresh", "false", {
                    httpOnly: true,
                    secure: true,
                    path: "/",
                    sameSite: "Lax"
                })
            ]);
            res.writeHead(302, { Location: "/"})
            res.end()
        } else {
            res.status(400).send("Missing Code")
        }
    } else {
        res.status(405).send("Method not allowed")
    }
}