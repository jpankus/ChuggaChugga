//connect to my firebase
var myFirebase = new Firebase('https://fb-train-schedule.firebaseio.com/');

// grab data from form
$("#submit").on('click', function(){
  var train = $("#train_name").val().trim();
  var destination = $("#destination").val().trim();
  var frequency = $("#frequency").val().trim();
  var firstTrain = $("#firstTrain").val().trim();

  //add data from form and add it to firebase DB
  myFirebase.push({
              trainName: train,
              destination: destination,
              frequency: frequency,
              firstTrain: firstTrain
          })
  })

//display data
myFirebase.on('child_added', function(childSnapshot) {
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
