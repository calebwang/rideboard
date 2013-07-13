var express = require('express');
var app = express();
var connect = require('connect')
var databaseUrl = 'rideboard-db';
var collections = ['events'];
var db = require('mongojs').connect(databaseUrl, collections);

app.use(express.bodyParser());
app.use(connect.compress());
app.use(express.static(__dirname + '/public'));
app.use(app.router);

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.locals.pretty=true;

//event creation page
app.get('/', function(req, res){
  res.render('index');
  console.log(req.params); 
  console.log('Serving /index');
});

//create new event
app.post('/', function(req, res){
  var id = new ObjectId();
  var newEvent = {
    _id: id,
    name: req.body.name,
    time: req.body.time,
    participants: []};
  db.events.insert(newEvent);
  res.redirect("/"+id.str);
});
  

app.post('/:eventId', function(req, res){
  res.render('index');
  console.log(req.query); 
  console.log('Serving /index');
});

//update an event
app.put('/:eventId', function(req, res){
  res.render('index');
  console.log(req.query); 
  console.log('Serving /index');
});

var port = process.env.PORT || 8080

app.listen(port, function() {
  console.log('Listening on port ' + port);
});
