/*
 * Copyright © HatioLab Inc. All rights reserved.
 */

const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties : [{
    type: 'number',
    label: 'latitude',
    name: 'lat',
    property: 'lat'
  }, {
    type: 'number',
    label: 'longitude',
    name: 'lng',
    property: 'lng'
  }, {
    type: 'number',
    label: 'zoom',
    name: 'zoom',
    property: 'zoom'
  }, {
    type: 'string',
    label: 'api-key',
    name: 'apiKey',
    property: 'apiKey'
  }]
}

var { HTMLOverlayContainer } = scene

export default class GoogleMap extends HTMLOverlayContainer {

  static load(component) {
    if(GoogleMap.loaded) {
      component.onload()
      return
    }

    /* TODO google map api는 한번만 로딩되어야 한다. */
    if(this.script) {
      GoogleMap.readies.push(component)
      return
    }

    this.readies = [component]

    var script = document.createElement('script');
    script.onload = function() {
      GoogleMap._loaded = true
      GoogleMap.readies.forEach(component => component.onload())
      delete GoogleMap.readies
    }

    var key = component.get('apiKey');
    script.src = 'https://maps.googleapis.com/maps/api/js' + (key ? '?key=' + key : '');

    document.head.appendChild(script)
    GoogleMap.script = script
  }

  createElement() {
    super.createElement();

    GoogleMap.load(this)
  }

  onload() {
    var marker = this.marker
  }

  get tagName() {
    return 'div'
  }

  // get value() {
  //   this.get('href')
  // }

  // set value(v) {
  //   this.set('href', v)
  // }

  get map() {
    if(!this._map) {
      var {
        lat,
        lng,
        zoom
      } = this.model

      this._map = new google.maps.Map(this.element, {
        zoom,
        center: {lat, lng}
      });
    }

    return this._map
  }

  get marker() {
    if(!this._marker) {
      let { lat, lng } = this.model

      this._marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map
      });
    }

    return this._marker
  }

  setElementProperties(div) {
  }

  onchange(after, before) {
    if(after.zoom)
      this.map.setZoom(after.zoom)

    if(after.lat || after.lng) {
      let { lat, lng } = this.model
      this.map.setCenter(new google.maps.LatLng(lat, lng));
    }

    super.onchange(after, before)
  }

  get nature() {
    return NATURE;
  }
}

scene.Component.register('google-map', GoogleMap);
