var express = require('express');
var app = express();
var connect = require('connect');
var databaseUrl = 'rideboardDb';
var collections = ['events'];
var db = require('mongojs').connect(databaseUrl, collections);
var ObjectId = require('mongojs').ObjectId;

app.use(express.bodyParser());
app.use(connect.compress());
app.use(express.static(__dirname + '/public'));
app.use(app.router);

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.locals.pretty=true;

app.get('/', function(req, res){
  res.render('index');
  console.log('Serving /index');
});

app.get('/:eventId', function(req, res) {
  console.log("get /eventId: " + req.params);
  var id = new ObjectId(req.params.eventId);
  db.events.find({ "_id": id}, function(err, data){
    console.log(data[0]);
    console.log(data[0].participants);
    console.log("get /eventId :" + data[0]);
    res.render('dashboard', {
      eventId: id, 
      event_data: data[0]
    });
  });
});

//create new event
app.post('/', function(req, res){
  var id = new ObjectId();
  var newEvent = {
    _id: id,
    event_name: req.body.event_name,
    event_location: req.body.event_location,
    event_date: req.body.event_date,
    event_time: req.body.event_time,
    participants: []};
  db.events.insert(newEvent, function(err, docs) {
    console.log(docs);
    console.log("post / id: " + id);
    res.redirect("/" + id);
  });
});

//add a participant 
app.post('/:eventId/newUser', function(req, res){
  var id = new ObjectId(req.params.eventId);
  var newParticipant = req.body;
  console.log('Adding new user');
  console.log(req.body);
  db.events.find({ _id: id, participants: { $elemMatch: { username: newParticipant.username }}},
    function(err, sameNames){
      if (sameNames.length != 0) {
        //need to handle error
        console.log("ERROR: two participants with the same name");
      } else {
          db.events.update(
            {_id: id},
            {$push:{ participants: newParticipant }}, 
            function(err, docs){
              console.log(arguments);
              db.events.find({"_id": id},
                function(err, participants){
                  res.json(participants)
                });
          });
      }
    });
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
