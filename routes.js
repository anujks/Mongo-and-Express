var express = require('express'),
	swig = require('swig');

var app = express();
 

app.engine('html', swig.renderFile);
app.set('view engine', 'html'); //.html file extensions by default

app.set('view cache', false); // Disble cache for development

// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });

app.set('views', __dirname + '/demo'); //view directory


app.get('/', function(req, res){
	res.send('Hello')
});

var web = express.Router();

web.get('/about', function(req, res){
	res.render('about');
});

web.get('/node', function(req, res){
	res.render('node');
});

var api = express.Router();
api.get('/about', function(req, res){
	res.json({'name': 'express'});
});

app.use(web);
app.use('/api', api);

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

