const cookie = require('cookie')
const signature = require('cookie-signature')

export default function handler(req,res) {
    if(req.method === "GET") {
        const { code } = req.query
        if(code) {
            const secret = process.env.JWT_SECRET
            const signedRefresh = 's:' + signature.sign('false', secret)
            const signedAuthCode = 's:' + signature.sign(code, secret) 
            res.setHeader("Set-Cookie", [
                cookie.serialize("authCode", signedAuthCode, {
                    httpOnly: true,
                    secure: true,
                    path: "/",
                    sameSite: "Lax"
                }),
                cookie.serialize("refresh", signedRefresh, {
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

