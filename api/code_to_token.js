const request = require("request");
const jwt = require("jsonwebtoken");

export default function handler(req,res) {
    if(req.method === "POST") {
         const result = {};
          const reqData = {
            code: req.body.code,
            client_id: req.body.clientID,
            client_secret: req.body.clientSecret,
            grant_type: "authorization_code",
            redirect_uri: process.env.REDIRECT_URI,
          };
        
          request.post(
            req.body.tokenEndpoint,
            {
              form: reqData,
            },
            (err, response, body) => {
              result.body = body;
              result.response = response;
              // and add the decoded token
              result.decodedToken = JSON.stringify(
                jwt.decode(result.id_token, { complete: true }),
              );
              res.json(result);
            },
          );
    }
}