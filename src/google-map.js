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
      GoogleMap.loaded = true
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

    this._markerComponents = []
    this._markers = []

    GoogleMap.load(this)
  }

  onload() {
    var map = this.map

    this.buildMarkers()

    // setting options here ..
  }

  get tagName() {
    return 'div'
  }

  get map() {
    if(!this._map) {
      var {
        lat,
        lng,
        zoom
      } = this.model

      this._map = new google.maps.Map(this.element, {
        zoom,
        center: { lat, lng }
      });
    }

    return this._map
  }

  dispose() {
    this._markerComponents && this._markerComponents.slice().forEach(component => {
      this.removeMarker(component)
    })

    delete this._markerComponents
    delete this._markers

    super.dispose()
  }

  buildMarkers() {
    var markers = []

    this._markerComponents.forEach(component => {
      let { lat, lng } = component.model

      markers.push(new google.maps.Marker({
        position: { lat, lng },
        map: this.map
      }))
    })

    this._markers = markers
  }

  refreshMarkers() {
    var markers = this._markers

    if(!GoogleMap.loaded)
      return

    this._markerComponents.forEach((component, idx) => {
      let marker = markers[idx]
      let { lat, lng } = component.model

      marker.setPosition(new google.maps.Marker({
        position: { lat, lng },
        map: this.map
      }))
    })
  }

  touchMarker(component) {
    var idx = this._markerComponents.indexOf(component)
    if(idx == -1 || !GoogleMap.loaded)
      return

    var marker = this._markers[idx]
    var { lat, lng } = component.model

    marker.setPosition(new google.maps.Marker({
      position: { lat, lng },
      map: this.map
    }))
  }

  onmarkerchange(after, before, hint) {
    var component = hint.source

    if(after.hasOwnProperty('lat') || after.hasOwnProperty('lng'))
      this.touchMarker(component)
  }

  addMarker(component) {
    var markerComponents = this._markerComponents
    var markers = this._markers

    if(markerComponents.indexOf(component) == -1) {
      markerComponents.push(component)
      component.on('change', this.onmarkerchange)

      if(!GoogleMap.loaded)
        return

      let { lat, lng } = component.model

      markers.push(new google.maps.Marker({
        position: { lat, lng },
        map: this.map
      }))
    }
  }

  removeMarker(component) {
    var idx = this._markerComponents.indexOf(component)
    if(idx == -1)
      return

    component.off('change', this.onmarkerchange)
    this._markerComponents.splice(idx, 1)
    var marker = this._markers.splice(idx, 1)
    marker && marker.setMap(null)
  }

  get markers() {
    if(!this._markerComponents) {
      this._markerComponents = []
      this._markers = []
    }

    return this._markers
  }

  setElementProperties(div) {
  }

  onchange(after, before) {
    if(GoogleMap.loaded) {
      if(after.zoom)
        this.map.setZoom(after.zoom)

      if(after.hasOwnProperty('lat') || after.hasOwnProperty('lng')) {
        let { lat, lng } = this.model
        this.map.setCenter(new google.maps.LatLng(lat, lng));
      }
    }

    super.onchange(after, before)
  }

  get nature() {
    return NATURE;
  }
}

scene.Component.register('google-map', GoogleMap);
