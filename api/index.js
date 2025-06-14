const express = require("express");
const session = require("express-session");


const path = require("path")
const serverless = require("serverless-http")


require("dotenv").config({ silent: true });


const app = express();


app.use(require("body-parser").json());


app.use(express.static('public'));


app.use((req, res, next) => {
 const proto = req.headers["x-forwarded-proto"];
 if (proto && proto !== "https") {
   return res.redirect(302, `https://${req.hostname}${req.originalUrl}`);
 }


 return next();
});


app.use((req, res, next) => {
 res.setHeader("X-Frame-Options", "DENY");
 next();
});


/* const FileStore = require("session-file-store")(session);


app.use(
 session({
   store: new FileStore(),
   secret: process.env.JWT_SECRET,
   resave: false,
   saveUninitialized: false,
   proxy: true,
   cookie: { secure: process.env.NON_SECURE_SESSION !== "true" },
 }),
); */


/* app.get("*", (req, res) => {
 let code = null;
 if (!req.session.refresh && req.session.authCode) {
   code = req.session.authCode;
 
   req.session.refresh = true;
  
 }
 res.render("index", {
   code,
   redirect_uri: process.env.REDIRECT_URI,
   state: crypto.randomBytes(20).toString("hex"),
   clientId: process.env.CLIENT_ID,
   clientSecret: process.env.CLIENT_SECRET,
 });
}); */

app.listen(process.env.PORT || 3000, () => console.log("server started on port 3000"))


module.exports = serverless(app);
