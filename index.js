'use strict'

let express = require('express')
let passport = require('passport')
let Strategy = require('./strategy').Strategy;
let dotenv = require('dotenv').config();

passport.serializeUser(function(user, cb){
	cb(null, user)
})

passport.deserializeUser(function(obj, cb){
	cb(null, obj)
})

let app = express()

app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(require('express-session')(
	{ 
		secret: 'keyboard cat',
		resave: true,
		saveUninitialized: true
	}))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.static('public'));

app.set('view engine', 'jade')

app.get('/',
  function(req, res){
    res.render('index')
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


app.listen(3000)






