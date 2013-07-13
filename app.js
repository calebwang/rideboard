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
    drivers: [],
    riders: []
  };
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
  if (req.body.isDriver === "Yes") { 
    db.events.find({ _id: id, drivers: { $elemMatch: { username: newParticipant.username }}},
      function(err, sameNames){
        if (sameNames.length != 0) {
          //need to handle error
          console.log("ERROR: two drivers with the same name");
        } else {
            db.events.update(
              {_id: id},
              {$push:{ drivers: newParticipant }}, 
              function(err, docs){
                console.log(arguments);
                db.events.find({"_id": id},
                  function(err, drivers){
                    res.json(drivers)
                  });
            });
        }
      });
  } else {
    db.events.find({ _id: id, riders: { $elemMatch: { username: newParticipant.username }}},
      function(err, sameNames){
        if (sameNames.length != 0) {
          //need to handle error
          console.log("ERROR: two riders with the same name");
        } else {
            db.events.update(
              {_id: id},
              {$push:{ riders: newParticipant }}, 
              function(err, docs){
                console.log(arguments);
                db.events.find({"_id": id},
                  function(err, riders){
                    res.json(riders)
                  });
            });
        }
      });
  }
});

//modify a rider 
app.put('/:eventId/updateRider', function(req, res){
  var id = new ObjectId(req.params.eventId);
  var update = req.body;
  console.log('modifying user');
  console.log(req.body)
  db.events.update({ _id: id, 
                     riders: { $elemMatch: { username : req.body.rider_name }}
                   }, 
                   { $set: { 'riders.$.driver': req.body.driver }},
                   function(err, docs){
                     console.log(arguments);
                   });
});

//modify a rider 
app.delete('/:eventId/deleteRider', function(req, res){
  var id = new ObjectId(req.params.eventId);
  var update = req.body;
  console.log('deleting user');
  console.log(req.body)
  db.events.update({ _id: id, 
                     riders: { $elemMatch: { username : req.body.rider_name }}
                   }, 
                   { $pull: {
                       riders: {  username : req.body.rider_name }
                   }},
                   function(err, docs){
                     console.log(arguments);
                   });
});


var port = process.env.PORT || 8080

app.listen(port, function() {
  console.log('Listening on port ' + port);
});
