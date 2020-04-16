import { display } from "display";
import document from "document";
import { HeartRateSensor } from "heart-rate";
import { OrientationSensor } from "orientation";

const hrmLabel = document.getElementById("hrm-label");
const hrmData = document.getElementById("hrm-data");

const orientationLabel = document.getElementById("orientation-label");
const orientationData = document.getElementById("orientation-data");

const sensors = [];


if (HeartRateSensor) {
  const hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener("reading", () => {
    hrmData.text = JSON.stringify({
      heartRate: hrm.heartRate ? hrm.heartRate : 0
    });
  });
  sensors.push(hrm);
  hrm.start();
} else {
  hrmLabel.style.display = "none";
  hrmData.style.display = "none";
}

if (OrientationSensor) {
  const orientation = new OrientationSensor({ frequency: 60 });
  orientation.addEventListener("reading", () => {
    orientationData.text = JSON.stringify({
      quaternion: orientation.quaternion ? orientation.quaternion.map(n => n.toFixed(1)) : null
    });
  });
  sensors.push(orientation);
  orientation.start();
} else {
  orientationLabel.style.display = "none";
  orientationData.style.display = "none";
}

display.addEventListener("change", () => {
  // Automatically stop all sensors when the screen is off to conserve battery
  display.on ? sensors.map(sensor => sensor.start()) : sensors.map(sensor => sensor.stop());
});
