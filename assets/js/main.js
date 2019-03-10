
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBtSK3Fu9SxYdgbGtEF6Njuzd3Ev_rAq7E",
    authDomain: "bootcamp-ca7b3.firebaseapp.com",
    databaseURL: "https://bootcamp-ca7b3.firebaseio.com",
    projectId: "bootcamp-ca7b3",
    storageBucket: "bootcamp-ca7b3.appspot.com",
    messagingSenderId: "607291037793"
  };
  firebase.initializeApp(config);
  var database = firebase.database();        

  var train = {
       trainName :"",
       destination :"",
       firstTime:"",
       frequency :""
   }


  // Add record to firebase 
      function addTrain(){
        var trainName   = $("#trainName").val().trim(),
            destination = $("#destination").val().trim(),
            firstTime   = $("#firstTime").val().trim(),
            frequency   = $("#frequency").val().trim();

          database.ref().push({
              ftrainName:   trainName,
              fdestination: destination,
              ffirstTime:   firstTime.trim(),
              ffrequency:   frequency,
              dateAdded:    firebase.database.ServerValue.TIMESTAMP
            });
            showRow();
      }

      function showRow (){
        $('tbody').empty();
        database.ref().on("child_added", function (snapshot) {

          train.trainName = snapshot.val().ftrainName,
          train.destination = snapshot.val().fdestination,
          train.firstTime = snapshot.val().ffirstTime,
          train.frequency =snapshot.val().ffrequency

          var trainTime = moment(train.firstTime, "hh:mm").subtract(1, "years");
          console.log(train.firstTime)

          let tRemainder = moment().diff(moment.unix(train.firstTime), "minutes") % train.frequency;
          let tMinutes = train.frequency - tRemainder;
          let tArrival = moment().add(tMinutes, "m").format("hh:mm A");


          // Creating elements to display data on page
          var tRow = $("<tr>").addClass("text-center");
          $("<td>").text(train.trainName).appendTo($(tRow));
          $("<td>").text(train.destination).appendTo($(tRow));
          $("<td>").text(train.frequency).addClass("text-center").appendTo($(tRow));
          $("<td>").text(tArrival).appendTo($(tRow));
          $("<td>").text(tMinutes).appendTo($(tRow));
          $("<td>").html('<a train-id='+ snapshot.key +' class="trash"><i class="fas fa-trash "></i></a>').appendTo($(tRow));
         
          $("tbody").append(tRow);
    
          // Handle the errors
        }, function (errorObject) {
        //  console.log("Errors handled: " + errorObject.code);
        });

      }
  // Main Body     
  $(document).ready(function(){
        showRow();
    
    // Show Train Form
        $('#newBtn').click(function(){
            $('.newCard').removeClass('newCardClose').addClass('newCardOpen');
        });

    // Submit Form 
        $("form :button[type='submit']").click(function (){             
            $('.newCard').removeClass('newCardOpen').addClass('newCardClose');
            addTrain();
            $("#trainName").val("")
            $("#destination").val("")
            $("#firstTime").val("")
            $("#frequency").val("")
        });
        $("form :button[type='reset']").click(function (){             
          $('.newCard').removeClass('newCardOpen').addClass('newCardClose');

        });
    // Delete Item    
        $(document).on("click", ".trash", function (e) {
          e.preventDefault();
          $(this).closest ('tr').remove();
          var getKey = $(this).attr("train-id");
          database.ref( getKey).remove();
          
      });




  });