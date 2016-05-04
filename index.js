'use strict'

let express = require('express')
let session = require('express-session')
let genuuid = require('uid-safe')
let dotenv = require('dotenv').config()
let sha1 = require('sha1')
let crypto = require('crypto')
let request = require('request')

let app = express()

// app.use(require('body-parser').urlencoded({ extended: true }))
app.use(require('body-parser').json())

app.use(express.static('public'));

var FileStore = require('session-file-store')(session);
 
app.use(session({
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'jade')

app.get('/',
  function(req, res){
  	let code = null, tokenInfo = null, tokenResponse = null
  	if(!req.session.refresh && req.session.authCode){
	  	code = req.session.authCode
	  	req.session.refresh = true
	}
    res.render('index', { 
    	code,
    	redirect_uri: process.env.REDIRECT_URI,
    	state: sha1(crypto.randomBytes(1024).toString())
    })
  }
);

app.get('/callback', function(req, res){
	if(req.query.code){
		req.session.refresh = false
		req.session.authCode = req.query.code
		res.redirect('/')
	}
})

app.post('/code_to_token', function(req, res){
	//REQUIRED params: code, clientID, clientSecret, tokenEndpoint, serviceURL
	//step 1: exchange code for token with OIDC server
	//step 2: send back https response from OIDC server
	let result = {};
	console.log('body', req.body)
	if(req.body.server == 'Auth0'){
		console.log('Auth0 token request...')
		let reqData = {
				code: req.body.code,
				client_id: req.body.clientID,
				client_secret: req.body.clientSecret,
				grant_type: 'authorization_code'
				redirect_uri: process.env.REDIRECT_URI
			}
		request.post(req.body.serverURL + req.body.tokenEndpoint, {
			form: reqData
		}, function(err, response, body){
			console.log(err, response.statusCode, body)
			result.body = body
			result.response = response
			res.end(JSON.stringify(result))
		})
	} else if (req.body.server == 'google'){
		console.log('Google token request...')
		request.post('https://www.googleapis.com/oauth2/v4/token', 
		{
			form: {
				code: req.body.code,
				client_id: req.body.clientID,
				client_secret: req.body.clientSecret,
				grant_type: 'authorization_code',
				redirect_uri: process.env.REDIRECT_URI
			}
		}, function(err, response, body){
			console.log(err, response.statusCode, body)
			result.body = body
			result.response = response	
			res.end(JSON.stringify(result))
		})
	}
});

app.post('/validate', function(req, res){
	//REQUIRED: token, clientSecret
	//step 1: validate the token
	//step 2: send back the results.
})


app.listen(process.env.PORT || 5000)






