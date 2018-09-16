// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the Train Scheduler database.
// 4. Create a way to calculate the how many minutes away real-time trains. Using difference between start time and how many mintues each hour times how many hours from start time till current time..
//    Then use moment.js formatting to set difference in how many mintues away.

// 1. Initialize Firebase 
var config = {
    apiKey: "AIzaSyA6OoN9zJQUWS29-X-_AJVmtf44rDD6ORI",
    authDomain: "train-scheduler-c8776.firebaseapp.com",
    databaseURL: "https://train-scheduler-c8776.firebaseio.com",
    projectId: "train-scheduler-c8776",
    storageBucket: "train-scheduler-c8776.appspot.com",
    messagingSenderId: "424141486530"
  };
  
  firebase.initializeApp(config);

  var database = firebase.database();

  // 2. Button for adding trains
  $("#add-train-btn").on("click", function(event) {
      event.preventDefault();

      //user input
      var trainName = $("#train-name-input").val().trim();
      var trainDest = $("#destination-input").val().trim();
      var trainTime = $("#train-time-input").val().trim();
      var trainFreq = $("#frequency-input").val().trim();
      
      //first time
      var firstTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");

      //current time
      var currentTime = moment(currentTime).format("hh:mm");

      //diff between times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

      //remainder for time apart
      var tRemainder = diffTime % trainFreq;

      //minutes till train arrives
      var tillTrain = trainFreq - tRemainder; 
     
      //next time for train
      var nextTrain = moment().add(tillTrain, "minutes");
      var trainAway = moment(nextTrain).format("hh:mm");

      //local temp object for train data
      var newTrain = {
          name: trainName,
          dest: trainDest,
          freq: trainFreq,
          time: trainAway,
          away: tillTrain,
      };

      //pushing to database
      database.ref().push(newTrain);

      alert("Train added");

      //clears text boxes
      $("#train-name-input").val("");
      $("#destination-input").val("");
      $("#train-time-input").val("");
      $("#frequency-input").val("");
    });

    // 3. create Firebase event for adding a train to the database and a row in the html when a user adds an entry
    database.ref().on("child_added", function(childSnapshot){

        //storing into var
        var trainName = childSnapshot.val().name;
        var trainDest = childSnapshot.val().dest;
        var trainFreq = childSnapshot.val().freq;
        var trainAway = childSnapshot.val().time;
        var tillTrain = childSnapshot.val().away;
        
        //create new row
        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(trainDest),
            $("<td>").text(trainFreq),
            $("<td>").text(trainAway),
            $("<td>").text(tillTrain),
            $("<td>").append("<button id='removeBtn'>remove</button>"),
        );

        //append the new row
        $("#train-table > tbody").append(newRow);

        //remove row
        $("#removeBtn").on("click", function(event) {
            event.preventDefault();
            $(newRow).remove();
        })
    });
