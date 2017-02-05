//connect to my firebase
var config = {
    apiKey: "AIzaSyApFR8L9CeTuTASpT1bZFh4YvhZq8lYaeg",
    authDomain: "traintime-beb5d.firebaseapp.com",
    databaseURL: "https://traintime-beb5d.firebaseio.com",
    storageBucket: "traintime-beb5d.appspot.com",
    messagingSenderId: "89395730090"
  };
  
  firebase.initializeApp(config);

             
// grab data from form
$("#submit").on('click', function(){
  var train = $("#train_name").val().trim();
  var destination = $("#destination").val().trim();
  var frequency = $("#frequency").val().trim();
  var firstTrain = $("#firstTrain").val().trim();

var database = firebase.database();
          
          database.ref().push({
              trainName: train,
              destination: destination,
              frequency: frequency,
              firstTrain: firstTrain
          });
  

//display data
database.on('child_added', function(childSnapshot) {
  // find when the next train is and minutes until next train
  var tfrequency = childSnapshot.val().frequency;
  // pushed back 1 year to make sure it comes before current time
  var convertedDate = moment(childSnapshot.val().firstTrain, 'hh:mm').subtract(1, 'years');
  var trainTime = moment(convertedDate).format('HH:mm');
  var currentTime = moment();
  // pushed back 1 year to make sure it comes before current time
  var firstTimeConverted = moment(trainTime,'hh:mm').subtract(1, 'years');
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  var tRemainder = diffTime % tfrequency;
  //solved
  var tMinutesTillTrain = tfrequency - tRemainder;
  //solved
  var nextTrain = moment().add(tMinutesTillTrain, 'minutes').format('HH:mm')

  //append DOM
  $("#schedule").append("<tr><td>" + childSnapshot.val().trainName + "</td><td>" +
  childSnapshot.val().destination + "</td><td>" + childSnapshot.val().frequency +
  "</td><td>" + trainTime + "</td><td>" + tMinutesTillTrain + "</td></tr>")
  },function(errorObject) {
    console.log('Errors handled: ' + errorObject.code);
  })

//refreashes train data every minute
setInterval(function(){
    location.reload();
  }, 60000)
