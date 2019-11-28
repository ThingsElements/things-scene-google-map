import icon from "../assets/gmap-marker.png";

export default {
  type: "gmap-marker",
  description: "google map marker",
  group: "etc",
  /* line|shape|textAndMedia|chartAndGauge|table|container|dataSource|IoT|3D|warehouse|form|etc */
  icon,
  model: {
    type: "gmap-marker",
    left: 150,
    top: 150,
    width: 40,
    height: 60,
    lat: 22.308117,
    lng: 114.225443,
    fillStyle: "#00ff00",
    hidden: true
  }
};