var express = require('express');
var app = express();
var connect = require('connect');
var databaseUrl = 'rideboardDb';
var collections = ['events'];
var db = require('mongojs').connect(databaseUrl, collections);

app.use(express.bodyParser());
app.use(connect.compress());
app.use(express.static(__dirname + '/public'));
app.use(app.router);

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.locals.pretty=true;

app.get('/', function(req, res){
  console.log(req.params); 
  res.render('index');
  console.log('Serving /dashboard');
});

app.get('/:eventId', function(req, res) {
  res.render('dashboard', {eventId: req.params.eventId});
});

app.post('/:eventId', function(req, res){
  console.log(req.params); 
  console.log(req.query); 
  console.log(req.body); 
  res.render('dashboard', {eventId: req.params.eventId});
  console.log('Serving /dashboard');
});

app.post('/:eventId/newUser', function(req, res){
  console.log(req.params); 
  console.log(req.query); 
  console.log(req.body); 
});

app.post('/', function(req, res){
  console.log(req.query); 
  res.render('index');
  console.log('Serving /index');
});

var port = process.env.PORT || 8080

app.listen(port, function() {
  console.log('Listening on port ' + port);
});
