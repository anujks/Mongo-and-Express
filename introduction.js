var express = require('express');
var cookieParser = require('cookie-parser')

var _ = require('underscore');

var app = express();

//app.use(cookieParser());

var tasks = [
				'express-js upgrade',
				'mongo-db upgrade'
			];

//app.disable('etag');

//Send text to browser
app.get('/', function(req, res){
	res.send('TODO App!!')
});

app.get('/page', function(req, res){
	res.send('page1');
});

app.get('/hello/:name', function(req, res){
	res.send('Name is ' + req.params.name, 200);
});

//Accessing URL Query parameters

//http://example.com/params?name=express-upgrade
//http://example.com/params?name=express&name=mongo -- param with more than one values

app.get('/params', function(req, res){
	console.log(typeof req.query.name);
	res.send('TODO App: ' + req.query.name)
});


//Send HTML text
app.get('/html', function(req, res){
	res.send("<html><body><h1>TODO App!!</h1></body></html>");
});

app.get('/tasks', function(req, res){
	var output = '';
	_.each(tasks, function(task){
		output += '<li> <h3>' + task + '</h3></li>';
	});

	res.send('<ul>' + output + '</ul>');
});

app.get('/task/add', function(req, res){
	tasks.push(req.query.name);
	res.redirect('/tasks');
});

app.get('/task/view/:index', function(req, res){
	res.send(tasks[parseInt(req.params.index)]);
});

app.get('/task/delete/:index', function(req, res){
	tasks.splice(parseInt(req.params.index));
	res.redirect('/tasks');
});

app.get('/task/update/:index', function(req, res){
	tasks[parseInt(req.params.index)] = req.query.name;
	res.redirect('/tasks');
});

app.get('/set-cookie', function(req, res){
	res.cookie('username', 'express', { maxAge: 900000 }).
	send('cookie set');
});

app.get('/my-cookie', function(req, res){
	console.log(req.headers['cookie']);
	res.send(req.headers['cookie']);
});

app.get('/task/add-form', function(req, res){
	res.send("<html>\
             <body>\
             	<form method='post' action='/task/post'>\
             		Name <input name='name' /> <br /> \
             		<input type='submit' value='Save' />\
             	</form>\
             </body>\
             </html>\
			");
});

var qs = require('querystring');

app.post('/task/post', function(req, res){

	 var body = '';
	    req.on('data', function (data) {
	        body += data;

	        // Too much POST data, kill the connection!
	        if (body.length > 1000)
	            req.connection.destroy();
	    });

        req.on('end', function () {
        	console.log(body);
            var postdata = qs.parse(body);
            console.log(postdata);

            tasks.push(postdata.name);
			res.redirect('/tasks');

            // use post['name'], etc.
        });
	
});

app.get('/error', function(req, res){
	throw "Server Error Page reached";
});

//TODO: File handling, upload, static files, caching etc

//POST

//404 Page(data) not found

app.use(function(req, res, next){
  res.status(404);
  res.send('What? Not found!!');
  //res.send('Data Not found??', 404);
});

 
// HTTP 500 Internal Server Error
app.use(function(error, req, res, next) {
 res.send('500 Internal Server Error ' + error, 500);
});


//JSON pretty JSON.stringify({ a: 1 }, null, 3)

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

