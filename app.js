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

//create new event
app.post('/', function(req, res){
  var id = new ObjectId();
  var newEvent = {
    _id: id,
    name: req.body.name,
    time: req.body.time,
    participants: []};
  db.events.insert(newEvent, function(err, docs) {
    console.log(arguments);
    res.redirect("/"+id.str);
  });
});

//add a participant 
app.post('/:eventId', function(req, res){
  var id = req.params.eventId;
  var newParticipant = req.body.newParticipant;
  var sameNames = db.events.find({ participants: { $elemMatch: { name: newParticipant.name }}});
  if (sameNames.length != 0) {
    //need to handle error
    console.log("ERROR: two participants with the same name");
  } else {
      db.events.update(
        {_id: new ObjectId(id)},
        {$push:{ participants: newParticipant }}, 
        function(err, docs){
          console.log(arguments);
          db.events.find({"_id": id},
            function(err, participants){
              res.json(participants)
            });
  }
});

app.post('/:eventId/newUser', function(req, res){
  console.log(req.params); 
  console.log(req.query); 
  console.log(req.body); 
});

//modify a participant
app.put('/:eventId', function(req, res){
  var id = req.params.eventId;
  var update = req.body.update;
  db.events.update(update, function(err, docs){
    console.log(arguments);
  });
});
    

var port = process.env.PORT || 8080

app.listen(port, function() {
  console.log('Listening on port ' + port);
});
