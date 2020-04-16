import * as messaging from "messaging";
import { settingsStorage } from "settings";
const MILLISECONDS_PER_MINUTE = 1000 * 10;
import { me as companion } from "companion";

// Tell the Companion to wake after 30 minutes
//companion.wakeInterval = MILLISECONDS_PER_MINUTE;

// Listen for the event
//companion.addEventListener("wakeinterval", fetchHeartRateData);

function fetchHeartRateData() {
 // Listen for the onopen event
   let message = {
      fetch : true
   };
	if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
		// Send the data to peer as a message

		console.log("Initiating heart rate from companion");
		sendMessage(message);
	}
	if (messaging.peerSocket.readyState === messaging.peerSocket.CLOSED) {
		messaging.peerSocket.onopen = function() {
			// Ready to send messages
  		console.log("Initiating heart rate from companion");
			sendMessage(message);
		}
	}
}
// Create Opsgenie Alarm
function createAlarm(data)  {
  let accessToken = "223d9c3a-7878-487c-8440-f8d6dbf8e34f";
  let headers = { 
    "Content-Type": 'application/json',
    "Authorization": `GenieKey ${accessToken}`
  };
  let body = {
    "message" : "Heart rate has exceeded " + data.hr,
    "responders" : [
       {
            "name":"Movies",
            "type":"team"
       }
    ],
    "tags": ["team-a"]
  };
  let url = "https://api.opsgenie.com/v2/alerts";
  console.log("Headers " + JSON.stringify(headers));
  console.log("Creating an alarm");
  // Create an alarm
  return fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  }).then(function(res) {
    console.log("Response: " + res.json());
  }).then(function(data) {
    console.log("Data: " + JSON.stringify(data));
  }).catch(err => console.log('[FETCH]: ' + err));
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  // Output the message to the console
  console.log("EVT " + JSON.stringify(evt.data));
  createAlarm(evt.data)
}