if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err))
  })
}
$(document).ready(function () {
  $("#stop_btn").hide();
  $("#bar").hide();   
  // jQuery methods go here...

  function notifyMe(data) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var notification = new Notification(data);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          var notification = new Notification(data);
        }
      });
    }
    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
  }

  var vaccineData = "";
  var totalOccur = 0;
  var available = 0;
  var interval = null;
  $("#enquire_btn").click(function () {
    $("#enquire_btn").hide();
    $("#stop_btn").show();
    $("#bar").show();    
    var dist = $("#dist").val();
    notifyMe("Notification Alerts are Enabled!");
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + "-" + mm + "-" + yyyy;
    console.log(today);
    var ddTemp = dd;
    runVaccine();
    var flag = 0;
    interval = setInterval(runVaccine, 1000);
    function runVaccine() {
      $(".runStatus").text("Running...");
      var dateVar = ddTemp + "-" + mm + "-" + yyyy;
      var vaccineDataLink = "";
      if (ddTemp < 10 && ddTemp != dd) {
        vaccineDataLink =
          "https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=" +
          dist +
          "&date=" +
          "0" +
          dateVar;
      } else {
        vaccineDataLink =
          "https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=" +
          dist +
          "&date=" +
          dateVar;
      }

      $.getJSON(vaccineDataLink, function (json) {
        console.log("JSON Fetch succesful!!  Date:  " + dateVar);
        vaccineData = JSON.stringify(json);
        totalOccur = vaccineData.match(/district_name/g).length;
        console.log("Total Centers = " + totalOccur);
        var nAvailable = vaccineData.match(/"available_capacity":0/g).length;
        available = Math.abs(totalOccur - nAvailable);
        console.log("Available Centers = " + available);
        if (available != 0) {
          notifyMe("Vaccination Available on: " + dateVar);
          $(".result").text("Available");
          $(".result").css("background-color", "LightGreen");
          $(".date").text(dateVar);
          $(".result").append("<p>" + available + "</p>");
        } else {
          $(".result").text("Un Available");
          $(".result").css("background-color", "LightPink");
        }
      });
      ddTemp++;
      flag++;

      if (flag > 6) {
        ddTemp = dd;
        flag = 0;
      } else {
        ddTemp = ddTemp;
      }
    }
  });

  $("#stop_btn").click(function (e) {
    console.log("Stop Clicked");
    clearInterval(interval);
    $("#stop_btn").hide();
    $("#enquire_btn").show();
    $("#bar").hide();
    $(".result").text(" ");
    $(".result").css("background-color", "White");
    $(".date").text(" ");
    $(".runStatus").text("Stopped");

    e.preventDefault();
  });
});
