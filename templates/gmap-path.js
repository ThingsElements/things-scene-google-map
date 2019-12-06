import icon from "../assets/gmap-path.png";

export default {
  type: "gmap-path",
  description: "google map path",
  group: "etc",
  /* line|shape|textAndMedia|chartAndGauge|table|container|dataSource|IoT|3D|warehouse|form|etc */
  icon,
  model: {
    type: "gmap-path",
    left: 150,
    top: 150,
    width: 40,
    height: 60,
    latlngs: [
      {
        lat: 22.308117,
        lng: 114.225443
      }
    ],
    startEndMarkerDifferentDesign: true,
    fillStyle: "#00ff00",
    hidden: true
  }
};
