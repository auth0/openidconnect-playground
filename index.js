'use strict'

const express = require('express')
const session = require('express-session')
const genuuid = require('uid-safe')
const dotenv = require('dotenv').config()
const sha1 = require('sha1')
const crypto = require('crypto')
const request = require('request')
const jwt = require('jsonwebtoken')
const jwkToPem = require('jwk-to-pem')

let app = express()

app.use(require('body-parser').json())

app.use(express.static('public'));

app.use(function (req, res, next) {
  const proto = req.headers['x-forwarded-proto'];
  if (proto && proto !== 'https') {
    return res.redirect(302, `https://${req.hostname}${req.originalUrl}`);
  }

  return next();
});

app.use(function (req, res, next) {
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

var FileStore = require('session-file-store')(session);

app.use(session({
  store: new FileStore(),
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: { secure: process.env.NON_SECURE_SESSION !== 'true' }
}));

app.set('view engine', 'jade')

app.get('/discover', function(req, res){
	request.get(req.query.url, function(err, resp, body){
		if(err) res.send(err)
		else res.send(body)
	})
})

app.get('/callback', function(req, res){
	if(req.query.code){
		req.session.refresh = false
		req.session.authCode = req.query.code
		res.redirect('/')
	}
  if(req.query.error){
    res.status(400).send(`${req.query.error}: ${req.query.error_description}`)
  }
})

app.get('*',
  function(req, res){
  	let code = null, tokenInfo = null, tokenResponse = null
  	if(!req.session.refresh && req.session.authCode){
	  	code = req.session.authCode
	  	req.session.refresh = true
	  }
    res.render('index', {
    	code,
    	redirect_uri: process.env.REDIRECT_URI,
    	state: crypto.randomBytes(20).toString('hex'),
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET
    })
  }
);

app.post('/code_to_token', function(req, res){
	//REQUIRED params: code, clientID, clientSecret, tokenEndpoint, serviceURL
	//step 1: exchange code for token with OIDC server
	//step 2: send back https response from OIDC server
	let result = {};
	let reqData = {
			code: req.body.code,
			client_id: req.body.clientID,
			client_secret: req.body.clientSecret,
			grant_type: 'authorization_code',
			redirect_uri: process.env.REDIRECT_URI
		}
	request.post(req.body.tokenEndpoint, {
		form: reqData
	}, function(err, response, body){
		result.body = body
		result.response = response
		//and add the decoded token
		result.decodedToken = JSON.stringify(jwt.decode(result.id_token, {complete: true}))
		res.end(JSON.stringify(result))
	})
});

app.post('/validate', function(req, res){
	//REQUIRED: token, clientSecret, server
	// server is because we need to know what to do with/to/where to get the key
	let secret;

	if(req.body.server == 'Auth0'){
		// Auth0 base64 encodes its secrets
		secret = new Buffer(req.body.clientSecret, 'base64')
		verify(function(err, decoded){
			if(err){
				res.statusMessage = err
				res.status(400).end()
			} else {
				res.status(200).end(decoded)
			}
		})
	} else if(req.body.tokenKeysEndpoint){
		//go get the keys!
		request.get(req.body.tokenKeysEndpoint, function(err, resp, body){
			let keys = JSON.parse(body).keys
			let done = false
			//we have to try EACH key
			for(let i = 0; i < keys.length; i++){
				secret = jwkToPem(keys[i]);
				verify(function(err, decoded){
					if(err){
						res.statusMessage = err
						res.status(400).end()
					} else if(decoded && !done){
						res.json(decoded).end()
						done = true
					}
				})
			}
			setTimeout(function(){
				// if we get here, none of the keys worked
				if(!done){
					res.statusMessage = 'Invalid Signature'
					res.sendStatus(400).end('Invalid Signature')
				}
			}.bind(this), 250)
		})
	} else {
		secret = req.body.clientSecret
		verify(function(err, decoded){
			if(err){
				res.status(400).statusMessage(err).end
			} else {
				res.status(200).end(decoded)
			}
		})
	}

	function verify(cb){
		jwt.verify(req.body.idToken, secret, { algorithims: ['HS256', 'RS256'] },function(err, decoded){
			if (err){
				cb(err, null)
			} else {
				cb(null, JSON.stringify(decoded))
			}
		})
	}
	//step 1: validate the token
	//step 2: send back the results.
})


app.listen(process.env.PORT || 5000)
