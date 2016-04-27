'use strict'

let express = require('express')
let session = require('express-session')
let genuuid = require('uid-safe')

let app = express()

// app.use(require('cookie-parser')({ secret: 'keyboard-cat'}))
app.use(require('body-parser').urlencoded({ extended: true }))
// app.use(require('query-parser'));

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
  	let code = null
  	if(!req.session.refresh && req.session.authCode){
	  	code = req.session.authCode
	  	req.session.refresh = true
	}
    res.render('index', { code : code })
  }
);

app.get('/callback', function(req, res){
	if(req.query.code){
		req.session.refresh = false
		req.session.authCode = req.query.code
		res.redirect('/')
	}
})

app.post('code_to_token', function(req, res){
	//REQUIRED params: code, clientID, clientSecret, tokenEndpoint, serviceURL
	//step 1: exchange code for token with OIDC server
	//step 2: send back https response from OIDC server
});

app.post('validate', function(req, res){
	//REQUIRED: token, clientSecret
	//step 1: validate the token
	//step 2: send back the results.
})


app.listen(process.env.PORT || 5000)






