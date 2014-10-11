var express = require('express');

var app = express();
 
app.get('/', function(req, res){
	res.send('Hello')
});

app.get('/page1', function(req, res){
	console.log('URL => %s',req.url);
	console.log('HTTP Method => %s', req.method);
	console.log('Headers => ' + Object.keys(req.headers));

	res.send('page1');
}); 

//HTTP Status code
app.get('/page4', function(req, res){
	res.status(404).send('404, page not found');
});

//HTTP Status code
app.get('/page-error', function(req, res){
	res.status(500).send('500, internal server error');
});


//URL Parameter
app.get('/hello/:name', function(req, res){
	res.send('Hello '+ req.params.name);
});

//Query string
//http://localhost:3000/hello?name=express
app.get('/hello', function(req, res){
	console.log('name data type ' + typeof req.query.name);
	res.send('Hello ' + req.query.name);
});

//Query string, array of name(s)
//http://example.com/params?name=express&name=mongo
app.get('/hello-all', function(req, res){
	console.log('name data type: ' + typeof req.query.name);

	if (typeof req.query.name == 'object') {
		
		var output = '';
		for (var i in req.query.name) {
			output += 'Hello: ' + req.query.name[i] +" <br />";
		}

		return res.send(output);
	}

	res.send(req.query.name);
});

//Send HTML text header 'Content-Type': 'text/plain' set by default
app.get('/html', function(req, res){
	res.send("<html><body><h1>Hello</h1></body></html>");
});
   
//send plain text, http header
app.get('/plain-text', function(req, res){
	var text='plain text content';
	
	res.set({
  		'Content-Type': 'text/plain',
  		'Content-Length': text.length.toString(),
  	});

	res.send(text);
});

//serve file from directory
app.get('/file', function(req, res){
 	res.status(200).sendFile(__dirname + '/hello.js'); //beware of hacks!!
});

//file download (browser), mark as binary stream
app.get('/file-download', function(req, res){
	res.set('Content-Disposition', 
		'attachment; filename=hello.js;'); 
	res.set('Content-Type', 'application/octet-stream'); //or
 	res.status(200).sendFile(__dirname + '/hello.js'); //beware!!

 	//or
 	//res.download(__dirname + '/hello.js');
});



//static files
//app.use('/assets', express.static(__dirname + '/assets'));

app.get('/moved', function(req, res){
	res.redirect('/page1');
});

//Generate server error   
app.get('/error', function(req, res){
	throw "Server Error Page reached";
});

//404 Page(data) not found
app.use(function(req, res, next){
  res.status(404);
  res.send('What? Not found!!');
  //res.status(404).send('What? Not found!!')
});


 
// HTTP 500 Internal Server Error handling
app.use(function(error, req, res, next) {
 res.send('500 Internal Server Error ' + error, 500);
});


var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

