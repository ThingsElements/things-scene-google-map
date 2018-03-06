import locales from './locales'

import gmap from './assets/google-map.png';
import marker from './assets/gmap-marker.png';

var templates = [{
  type: 'google-map',
  description: 'google-map',
  group: 'etc',
  /* line|shape|textAndMedia|chartAndGauge|table|container|dataSource|IoT|3D|warehouse|form|etc */
  icon: gmap,
  model: {
    type: 'google-map',
    left: 150,
    top: 150,
    width: 300,
    height: 200,
    lat: 22.308117,
    lng: 114.225443,
    zoom: 20,
    apiKey: 'AIzaSyBgQZb-SFqjQBC_XTxNiz0XapejNwV9PgA'
  }
}, {
  type: 'gmap-marker',
  description: 'google map marker',
  group: 'etc',
  /* line|shape|textAndMedia|chartAndGauge|table|container|dataSource|IoT|3D|warehouse|form|etc */
  icon: marker,
  model: {
    type: 'gmap-marker',
    left: 150,
    top: 150,
    width: 40,
    height: 60,
    lat: 22.308117,
    lng: 114.225443,
    fillStyle: '#00ff00',
    hidden: true
  }
}];

module.exports = {
  templates,
  locales
};
