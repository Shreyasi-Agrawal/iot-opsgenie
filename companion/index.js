import * as messaging from "messaging";
import {
	settingsStorage
} from "settings";
const MILLISECONDS_PER_MINUTE = 1000 * 10;
import {
	me as companion
} from "companion";


// Create Opsgenie Alarm
function createAlarm(data) {
	let accessToken = "223d9c3a-7878-487c-8440-f8d6dbf8e34f";
	let headers = {
		"Content-Type": 'application/json',
		"Authorization": `GenieKey ${accessToken}`
	};
	let body = {
		"message": "Heart rate has exceeded " + data.hr,
		"responders": [{
			"name": "Movies",
			"type": "team"
		}]
	};
	let url = "https://api.opsgenie.com/v2/alerts";
	console.log("Creating an alarm");
	// Create an alarm
	return fetch(url, {
		method: "POST",
		headers: headers,
		body: JSON.stringify(body)
	}).then(function(res) {
		//console.log("Response: " + res.json().get());
	}).then(function(data){
		console.log("Data: " + JSON.stringify(data));
	}).catch(err => console.log('[FETCH]: ' + err));
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
	// Output the message to the console
	console.log("Received message from device " + JSON.stringify(evt.data));
	createAlarm(evt.data)
}