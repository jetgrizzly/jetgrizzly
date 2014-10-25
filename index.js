var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var ip = process.env.IP  || undefined;
var Firebase = require("firebase");

// Serve static files from client/ . This file is copied to dist in production.
app.use(express.static(__dirname + '/client'));

var server = require('http').createServer(app);
// Start server
server.listen(port, ip, function () {
  console.log('Express server listening on %d!', port);
});

var queueRef = new Firebase('https://dazzling-torch-2714.firebaseio.com/queue/');
var videoRef = new Firebase('https://dazzling-torch-2714.firebaseio.com/youTube/');
//Will use beenCalled to throttle the number of calls to this listener
var beenCalled = false;

//Listen for changes to player state from firebase
videoRef.on('value', function (snapshot) {
  //Print whether this callback chain has already been called for the value change
  console.log('beenCalled: ', beenCalled);
  //If this is the first time this has been called
  if (!beenCalled) {
    beenCalled = true;
    //Check if the player is playing, print it
    var isPlaying = snapshot.val().isPlaying;
    console.log('isPlaying: ',isPlaying);
    //If player is not playing
    if (!isPlaying) {
      //Check the queue
      queueRef.once('value', function(queue) {
        console.log('queue: ', queue.val());
        //If the queue is not empty
        if (queue.val() !== null) {
          //Get the queue in array form
          var index = 0;
          var videoQueue = [];
          var nameQueue = [];
          queue.forEach(function(queueEntry){
            videoQueue[index] = queueEntry.val();
            nameQueue[index] = queueEntry.name();
            index ++;
          });
          //Parse the first link
          nextVid = videoQueue[0].split('v=')[1];
          console.log('next vid is: ', nextVid);
          //Set the currentVideo in firebase to the first item in queue s
          var currentVideo = videoRef.child('currentVideo');
          currentVideo.set(nextVid, function(){
            console.log('next vid saved');
            //Once next video has been sent, change beenCalled back to false
            beenCalled = false;
            var remove = new Firebase('https://dazzling-torch-2714.firebaseio.com/queue/'+nameQueue[0]);
            remove.remove(function(){
              console.log('removed top vid from queue');
            });
          });
        }
      });
    } else {
      beenCalled = false;
    }
  }
}, function (errorObject) {
  console.log('The read failed: ' + errorObject.code);
});

//To handle case of empty queue and stopped player, listen for added children to queue
queueRef.on('child_added', function(snap) {
  var nextName = snap.name();
  var nextID = snap.val().split('v=')[1];
  console.log('song added to queue', nextName);
  //When a child is added, check to see if the player is playing
  videoRef.once('value', function(player) {
    console.log('isPlaying: ', player.val().isPlaying);
    //If the player isn't playing
    if (!player.val().isPlaying) {
      console.log('start playing this video');
      var currentVideo = videoRef.child('currentVideo');
      //Send the newly added video to the player
      currentVideo.set(nextID, function(){
        console.log('next vid saved');
        //Once next video has been sent, change beenCalled back to false
        var remove = new Firebase('https://dazzling-torch-2714.firebaseio.com/queue/'+nextName);
        remove.remove(function(){
          console.log('removed top vid from queue');
        });
      });
    }
  });
});

// Expose app
exports = module.exports = app;
