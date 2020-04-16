import * as messaging from "messaging";
import { settingsStorage } from "settings";

// Create Opsgenie Alarm
function createAlarm(data)  {
  let accessToken = "223d9c3a-7878-487c-8440-f8d6dbf8e34f";
  let headers = { 
    "Content-Type": 'application/json',
    "Authorization": `GenieKey ${accessToken}`
  };
  let body = {
    "message" : "Heart rate has exceeded 123",
    "responders" : [
       {
            "name":"Movies",
            "type":"team"
       }
    ]
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
  createAlarm(evt)
}