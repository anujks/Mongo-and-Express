//Session, Web Form Autentication, Validator

var express = require('express'),
	cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser')
    session = require('express-session'),

    validator = require('validator'),
    expressValidator = require('express-validator');

    swig = require('swig'); // django/jinja style template




var app = express();

app.engine('html', swig.renderFile);
app.set('view engine', 'html'); //.html file extensions by default

app.set('view cache', false); // Disble cache for development

// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });

app.set('views', __dirname + '/demo'); //view directory

app.use(cookieParser('fDgfaRT243FDFrAS')); //with secure token for encryption

app.use(session({
    secret: 'fadsyg234lkjifasfds',
    maxAge: new Date(Date.now() + 3600000)
    }));

app.use(bodyParser.urlencoded({extended: true})); //parse post method content and set in body
app.use(expressValidator());

app.use(function(req, res, next){
	if (req.session.user) {
		req.user = req.session.user;
		res.locals.logged_in = true; //to be used in view
	}

	next();
});

function restrict(req, res, next) {
	if (!req.user) {
		//res.status(401).send('401 Not Authorized');
		//return res.end();
		res.redirect('/login' + '?next_url=' + req.url);
		return res.end();
	}

	next();
};

//first view

app.get('/', restrict, function(req, res){
	res.locals.name = 'express';
	res.render('home', {version: 4.2});
});

/*
app.get('/login', function(req, res){
	req.session.user = {name: 'express'};
	req.session.save();
	res.redirect('/');
});
*/

app.get('/login', function(req, res){

	 res.locals.next_url = req.query.next_url;
	 res.render('login');
});

/*
req.session.reload(function(err) {
  // session updated
});
*/

app.post('/login', function(req, res){
	console.log(req.body);

	req.assert('username', 'required').notEmpty();
	req.assert('password', '6 to 20 characters required').len(6, 20);

	var errors = req.validationErrors();
	var mappedErrors = req.validationErrors(true);

	console.log(errors);
	console.log(mappedErrors);

	if (errors) {
		res.locals.errors = errors;
	}

	if (mappedErrors) {
		res.locals.mappedErrors = mappedErrors;
	}

	 if (req.body.username == 'express' && req.body.password == 'express') {
	 	req.session.user = {name: req.body.username};
	 	req.session.save();

	 	return res.redirect(req.body.next_url || '/');
	 }

	 res.locals.next_url = req.body.next_url;
	 res.render('login');
});

app.get('/logout', function(req, res){
	  req.session.destroy();
	  res.redirect('/');
});


app.get('/about', restrict, function(req, res){
	res.render('about');
});

app.get('/node', restrict, function(req, res){
	res.render('node');
});
 

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});