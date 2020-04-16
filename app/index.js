import { display } from "display";
import document from "document";
import { HeartRateSensor } from "heart-rate";
import * as messaging from "messaging";

const hrmLabel = document.getElementById("hrm-label");
const hrmData = document.getElementById("hrm-data");
const sensors = [];
const THRESHOLD = 120;

if (HeartRateSensor) {
  const hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener("reading", () => {
    hrmData.text = JSON.stringify({
      heartRate: hrm.heartRate ? hrm.heartRate : 0
    });
    if(hrm.heartRate > THRESHOLD) {
      raiseAlarm();
    }
  });
  sensors.push(hrm);
  hrm.start();
} else {
  hrmLabel.style.display = "none";
  hrmData.style.display = "none";
}

display.addEventListener("change", () => {
  // Automatically stop all sensors when the screen is off to conserve battery
  display.on ? sensors.map(sensor => sensor.start()) : sensors.map(sensor => sensor.stop());
});

function raiseAlarm() {
  // Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Ready to send messages
  sendMessage();
};
  
  // Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}
  
}

// Send a message to the peer
function sendMessage() {
  var data = {
    hr: THRESHOLD
  }

  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send the data to peer as a message
    messaging.peerSocket.send(data);
  }
}
