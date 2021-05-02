// Register service worker to control making site work offline

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/vaccine-track/serviceworker.js")
    .then(function () {
      console.log("Service Worker Registered");
    });
}
// Initialize deferredPrompt for use later to show browser install prompt.


$(document).ready(function () {
  $("#install_btn").hide();
  $("#stop_btn").hide();
  $("#bar").hide();
  $(".result").hide();
  // jQuery methods go here...
  var audio = document.getElementById("notification"); 
  function playAudio() { 
    audio.play(); 
  }
  var vaccineData = "";
  var totalOccur = 0;
  var available = 0;
  var interval = null;
  $("#enquire_btn").click(function () {
    $("#enquire_btn").hide();
    $("#stop_btn").show();
    $("#bar").show();
    $(".result").show();
    var dist = $("#dist").val();    
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + "-" + mm + "-" + yyyy;
    console.log(today);
    var ddTemp = dd;
    runVaccine();
    var flag = 0;
    interval = setInterval(runVaccine, 3000);
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
          $(".result").text("Available");
          $(".result").css("background-color", "LightGreen");
          $(".date").text(dateVar);
          $(".result").append("<p>" + available + "</p>");
          playAudio();
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
    $(".result").hide();
    $(".result").text(" ");    
    $(".date").text(" ");
    $(".runStatus").text("Stopped");

    e.preventDefault();
  });
});
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can install the PWA
  showInstallPromotion();  
  // Optionally, send analytics event that PWA install promo was shown.
  console.log(`'beforeinstallprompt' event was fired.`);
});
function showInstallPromotion () {
  $("#install_btn").show();
}
function hideInstallPromotion () {
  $("#install_btn").hide();
}
window.addEventListener('click', async () => {
  // Hide the app provided install promotion
  hideInstallPromotion();
  // Show the install prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  // Optionally, send analytics event with outcome of user choice
  console.log(`User response to the install prompt: ${outcome}`);
  // We've used the prompt, and can't use it again, throw it away
  deferredPrompt = null;
});

window.addEventListener('appinstalled', () => {
  // Hide the app-provided install promotion
  hideInstallPromotion();
  // Clear the deferredPrompt so it can be garbage collected
  deferredPrompt = null;
  // Optionally, send analytics event to indicate successful install
  console.log('PWA was installed');
});