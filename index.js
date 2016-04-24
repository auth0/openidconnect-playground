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

app.set('view engine', 'jade')

app.get('/',
  function(req, res){
    res.render('index')
  })

app.get('/login', passport.authenticate('user-oidc'));

app.get('/callback',
	passport.authenticate('user-oidc', { failureRedirect: '/login'}),
	function(req, res){
		res.redirect('/profile')
	});

app.get('/custom',
	function(req, res, next){
		passport.use(new Strategy({
			authorizationURL: 'https://' + process.env.DOMAIN + '/authorize',
			tokenURL: 'https://' + process.env.DOMAIN + '/oauth/token',
			userInfoURL: 'https://' + process.env.DOMAIN + '/userinfo',
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: 'http://localhost:3000/callback',
			skipUserProfile: true
			},
			function(accessToken, refreshToken, profile, cb){
				// let token = JSON.parse(profile._raw)
				// console.log('PARSED', token.identities)
				// profile.token = token
				console.log('ACCESS', accessToken);
				cb(null, accessToken)
			} 
		))
		next()
	},
	passport.authenticate('user-oidc') 
)

app.get('/profile',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res){
		res.render('user', { user: req.user })
	})

app.get('/logout', function(req, res){
	req.logout()
	res.redirect('/')
});

app.listen(3000)






