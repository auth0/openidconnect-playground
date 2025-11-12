const express = require("express");

const path = require("path");
const serverless = require("serverless-http");

require("dotenv").config({ silent: true });

const app = express();

app.use(require("body-parser").json());

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

app.listen(process.env.PORT || 3000, () =>
  console.log("server started on port 3000")
);

module.exports = serverless(app);
