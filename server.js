var express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser')
    session = require('express-session'),
    morgan = require('morgan'),
    fs = require('fs'),

    swig = require('swig'),
     _ = require('underscore'),
    mongoose = require('mongoose'),

    passport = require('passport'),
    passportLocal =  require('passport-local'),

    validator = require('validator'),
    expressValidator = require('express-validator');

var app = module.exports = express();

//View Settings


app.engine('html', swig.renderFile);
app.set('view engine', 'html');

// NOTE: You should always cache templates in a production environment.

// Swig will cache templates for you, but you can disable
app.set('view cache', false);

// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });
app.set('views', __dirname + '/views'); //view directory



app.use(morgan('combined'));

app.use(cookieParser('fDgfaRT243FDFrAS')); //with secure token for encryption

app.disable('etag');


//app.use('/assets', express.static(__dirname + '/assets', {maxAge: 1000 * 60})); // with expiry
app.use('/assets', express.static(__dirname + '/assets'));

//middleware
app.use(bodyParser({keepExtensions: true, uploadDir:'./uploads'}));
 
app.use(expressValidator());
 
app.use(session({
    secret: 'fadsyg234lkjifasfds',
    maxAge: new Date(Date.now() + 3600000)
    }));


app.use(passport.initialize());
app.use(passport.session());


var mongoose = require('mongoose');


var NoteSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' }
}, { collection: 'notes' });


mongoose.model('Note', NoteSchema)

var Note = mongoose.model('Note');



mongoose.connect('mongodb://localhost/notesdb');

var router = express.Router();

app.use(router);



app.get('/', function(req, res){
  res.locals.name = "express";
  res.render('home', {version: '4'});
});

app.get('/new', function(req, res){
  var note = new Note();

  note.title = 'my note ' + Math.floor((Math.random() * 1000) + 1).toString();
  note.description = 'done in expressjs';

  note.save(function(err, saved){
    console.log('saved ' + saved);
    res.send('new note saved to db ' + saved);
  });

});

app.get('/list', function(req, res){
  
  Note.find(function(err, notes){
    var note_text = '';
    for (var i in notes) {
      note_text += notes[i].title + "</br>";
    }

    res.send(note_text);
  });
});


var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

