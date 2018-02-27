import locales from './locales'

var templates = [{
  name: 'Google MAP',
  /* 다국어 키 표현을 어떻게.. */
  description: '...',
  /* 다국어 키 표현을 어떻게.. */
  group: 'etc',
  /* line|shape|textAndMedia|chartAndGauge|table|container|dataSource|IoT|3D|warehouse|form|etc */
  icon: '../',
  /* 또는, Object */
  template: {
    type: 'google-map',
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
  }
}, {
  name: 'GMap Marker',
  /* 다국어 키 표현을 어떻게.. */
  description: '...',
  /* 다국어 키 표현을 어떻게.. */
  group: 'etc',
  /* line|shape|textAndMedia|chartAndGauge|table|container|dataSource|IoT|3D|warehouse|form|etc */
  icon: '../',
  /* 또는, Object */
  template: {
    type: 'gmap-marker',
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
  }
}];

module.exports = {
  templates,
  locales
};
