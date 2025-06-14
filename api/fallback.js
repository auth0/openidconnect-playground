const cookie = require("cookie")

module.exports = (req, res) => {
    const cookies = cookie.parse(req.headers.cookie || "")
    let code = null;
    const { authCode, refresh } = cookies 
    if(!refresh && authCode) {
        code = authCode
        res.setHeader("Set-Cookie", "refresh=true; Path=/; HttpOnly")
    }

    res.writeHead(302, { Location: "/"})
    res.end();
}
