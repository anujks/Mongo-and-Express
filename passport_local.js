//source https://github.com/jaredhanson/passport-local/blob/master/examples/express3/app.js

var express = require('express')
	, cookieParser = require('cookie-parser')
	, bodyParser = require('body-parser')
    , passport = require('passport')
	, swig = require('swig')
	, session = require('express-session')
//	, flash = require('connect-flash')
	, LocalStrategy = require('passport-local').Strategy;


var users = [
	{ id: 1, username: 'express', password: 'express', email: 'express@example.com' }, 
	{ id: 2, username: 'node', password: 'nde', email: 'node@example.com' }
];

function findById(id, fn) {
	var idx = id - 1;
	if (users[idx]) {
		fn(null, users[idx]);
	} else {
		fn(new Error('User ' + id + ' does not exist'));
	}
}

function findByUsername(username, fn) {
	for (var i = 0, len = users.length; i < len; i++) {
		var user = users[i];
		if (user.username === username) {
			return fn(null, user);
		}
	}
	return fn(null, null);
}

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	findById(id, function (err, user) {
	done(err, user);
});
});



// Use the LocalStrategy within Passport.
// Strategies in passport require a `verify` function, which accept
// credentials (in this case, a username and password), and invoke a callback
// with a user object. In the real world, this would query a database;
// however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
	function(username, password, done) {
		console.log('username is ' + username);

		// asynchronous verification, for effect...
		process.nextTick(function () {
		// Find the user by username. If there is no user with the given
		// username, or the password is not correct, set the user to `false` to
		// indicate failure and set a flash message. Otherwise, return the
		// authenticated `user`.
		findByUsername(username, function(err, user) {
			if (err) { return done(err); }
			if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
			
			if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
				return done(null, user);
		})
		});
	}
));

var app = express();

app.engine('html', swig.renderFile);
app.set('view engine', 'html'); //.html file extensions by default

app.set('view cache', false); // Disble cache for development

// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });

app.set('views', __dirname + '/demo'); //view directory

app.use(cookieParser('fDgfaRT243FDFrAS')); //with secure token for encryption

app.use(bodyParser.urlencoded({extended: true})); //parse post method content and set in body


app.use(session({
    secret: 'fadsyg234lkjifasfds',
    maxAge: new Date(Date.now() + 3600000)
    }));


app.use(passport.initialize());
app.use(passport.session());

//app.use(express.static(__dirname + '/../../public'));

//app.use(flash());


app.use(function(req, res, next){
	if (req.user) {
		res.locals.logged_in = true; //to be used in view
	}

	next();
});

 
app.get('/', ensureAuthenticated, function(req, res){
	res.locals.name = req.user.username;
	res.render('home', { user: req.user, version: 4.2 });
});

app.get('/about', ensureAuthenticated, function(req, res){
	res.render('about', { user: req.user });
});

app.get('/node', ensureAuthenticated, function(req, res){
	res.render('node', { user: req.user });
});


app.get('/login', function(req, res) {
	//message: req.flash('error') 
	res.render('login', { user: req.user});
});

// POST /login
// Use passport.authenticate() as route middleware to authenticate the
// request. If authentication fails, the user will be redirected back to the
// login page. Otherwise, the primary route function function will be called,
// which, in this example, will redirect the user to the home page.
//
// curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
app.post('/login',
	passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
	function(req, res) {
		res.redirect('/');
	}
);


app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

// Simple route middleware to ensure user is authenticated.
// Use this route middleware on any resource that needs to be protected. If
// the request is authenticated (typically via a persistent login session),
// the request will proceed. Otherwise, the user will be redirected to the
// login page.
function ensureAuthenticated(req, res, next) {
if (req.isAuthenticated()) { return next(); }
res.redirect('/login')
}

app.listen(3000, function() {
	console.log('Express server listening on port 3000');
});



