var express = require('express');

var app = express();

//middlewares, called one after another.
//app.use()


//called by order
app.use(function(req, res, next) {
  console.log('middleware 1');
  res.locals.outputs = ['middleware 1'];
  next();
});


//called by order
app.use(function(req, res, next) {
  console.log('middleware 2');
  res.locals.outputs.push('middleware 2');
  next();
});


//set cookie
app.use(function(req, res, next) {
  console.log('setting a cookie');
  res.cookie('username', 'express', { maxAge: 100 * 1000 }); //maxage in milli-seconds

  res.locals.outputs.push('cookie');
  next();
});

function cache(req, res, next) {
	res.locals.outputs.push('cache middleware');
	res.header('Cache-Control', 'max-age=30');
	res.header('Expires', '30');
	next();
}

function nocache(req, res, next) {
	res.locals.outputs.push('nocache middleware');
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
};

//hangs by missing next() or calling res.end()
/*
app.use(function(req, res, next){
});
*/

//stop the request in middle, like authentication/authorization
/*
app.use(function(res, res, next){
	res.status(400).send('Bad Request, break here');
	res.end();
});
*/

app.get('/', function(req, res){
	res.send(res.locals.outputs.join('<br />'));
});

app.get('/cached', cache, function(req, res){
	console.log(res.locals.outputs.join('\n'));
	res.send('cached content ' + Math.floor((Math.random() * 100) + 1))
});

app.get('/not-cached', nocache, function(req, res){
	console.log(res.locals.outputs.join('\n'));
	res.send('not cached ' + Math.floor((Math.random() * 100) + 1));
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});