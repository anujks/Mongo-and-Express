var express = require('express'),
	swig = require('swig'); // django/jinja style template

var app = express();

app.engine('html', swig.renderFile);
app.set('view engine', 'html'); //.html file extensions by default

app.set('view cache', false); // Disble cache for development

// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });

app.set('views', __dirname + '/demo'); //view directory

//first view

app.get('/', function(req, res){
	res.locals.name = 'express';
	res.render('home', {version: 4.2});
});

app.get('/about', function(req, res){
	res.render('about');
});

app.get('/node', function(req, res){
	res.render('node');
});

//!beware hacking, wildcard..
app.get('/dynamic/:name', function(req, res){
	res.render(req.params.name);
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});