/*
 * Copyright © HatioLab Inc. All rights reserved.
 */

const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties: [{
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

var {
  HTMLOverlayContainer
} = scene

function getGlobalScale(component) {
  var scale = {x: 1, y: 1};
  var parent = component;

  while(parent) {
    let { x, y } = parent.get('scale') || {x:1, y:1};
    scale.x *= x || 1;
    scale.y *= y || 1;

    parent = parent.parent
  }
  return scale;
}

export default class GoogleMap extends HTMLOverlayContainer {

  static load(component) {
    if (GoogleMap.loaded) {
      component.onload()
      return
    }

    /* TODO google map api는 한번만 로딩되어야 한다. */
    if (this.script) {
      GoogleMap.readies.push(component)
      return
    }

    this.readies = [component]

    var script = document.createElement('script');
    script.onload = function () {
      GoogleMap.loaded = true
      GoogleMap.readies.forEach(component => component.onload())
      delete GoogleMap.readies
    }

    var key = component.get('apiKey');
    script.src = 'https://maps.googleapis.com/maps/api/js' + (key ? '?key=' + key : '');

    document.head.appendChild(script)
    GoogleMap.script = script
  }

  ready() {
    super.ready()

    if(this.rootModel) {
      this._listenTo = this.rootModel
      this._listener = function(after) {
        after.scale && this.rescale()
      }.bind(this)
      this.rootModel.on('change', this._listener);
    }
  }

  removed() {
    if(this._listenTo) {
      this._listenTo.off('change', this._listener)

      delete this._listenTo
      delete this._listener
    }
  }

  /*
   * google map은 scale된 상태에서 마우스 포지션을 정확히 매핑하지 못하므로, 마커를 정상적으로 동작시키지 못한다.
   * 따라서, google map의 경우에는 부모의 스케일의 역으로 transform해서, scale을 1로 맞추어야 한다.
   */
  rescale() {
    var anchor = this._anchor;
    if(!anchor)
      return
    var scale = getGlobalScale(this)

    var sx = 1 / scale.x
    var sy = 1 / scale.y

    var transform = `scale(${sx}, ${sy})`;

    ['-webkit-', '-moz-', '-ms-', '-o-', ''].forEach(prefix => {
      anchor.style[prefix + 'transform'] = transform;
      anchor.style[prefix + 'transform-origin'] = '0px 0px';
    })

    var { width, height } = this.model
    anchor.style.width = width * scale.x + 'px'
    anchor.style.height = height * scale.y + 'px'

    if (GoogleMap.loaded) {
      google.maps.event.trigger(this.map, "resize");
      this.map.setCenter({
        lat: this.model.lat,
        lng: this.model.lng
      })
    }

  }

  createElement() {
    super.createElement();
    this._anchor = document.createElement('div')
    this.element.appendChild(this._anchor)
    this.rescale()

    this._markerComponents = []
    this._markers = []

    this._onmarkerchange = this.onmarkerchange.bind(this)

    GoogleMap.load(this)
  }

  onload() {
    var map = this.map

    this.buildMarkers()

    this.rescale()
  }

  get tagName() {
    return 'div'
  }

  get map() {
    if (!this._map) {
      var {
        lat,
        lng,
        zoom
      } = this.model

      this._map = new google.maps.Map(this._anchor, {
        zoom,
        center: {
          lat,
          lng
        }
      });
    }

    return this._map
  }

  dispose() {
    super.dispose()

    this._markerComponents && this._markerComponents.slice().forEach(component => {
      this.removeMarker(component)
    })

    delete this._markerComponents
    delete this._markers
    delete this._anchor
  }

  buildMarkers() {
    var markers = []

    this._markerComponents.forEach(component => {
      let {
        lat,
        lng
      } = component.model

      let marker = new google.maps.Marker({
        position: {
          lat,
          lng
        },
        map: this.map
      })
      markers.push(marker)

      component.marker = marker
    })

    this._markers = markers
  }

  touchMarker(component) {
    var idx = this._markerComponents.indexOf(component)
    if (idx == -1 || !GoogleMap.loaded)
      return

    var marker = this._markers[idx]
    var {
      lat,
      lng
    } = component.model

    marker.setPosition(new google.maps.LatLng(lat, lng))
  }

  onmarkerchange(after, before, hint) {
    var component = hint.origin

    if (after.hasOwnProperty('lat') || after.hasOwnProperty('lng'))
      this.touchMarker(component)
  }

  addMarker(component) {
    if(!this._markerComponents)
      this._markerComponents = []

    var markerComponents = this._markerComponents
    var markers = this._markers

    if (markerComponents.indexOf(component) == -1) {
      markerComponents.push(component)
      component.on('change', this._onmarkerchange)

      if (!GoogleMap.loaded)
        return

      let {
        lat,
        lng
      } = component.model

      let marker = new google.maps.Marker({
        position: {
          lat,
          lng
        },
        map: this.map
      })
      markers.push(marker)

      markers.push(marker)
      component.marker = marker
    }
  }

  removeMarker(component) {
    if(!this._markerComponents)
      return

    var idx = this._markerComponents.indexOf(component)
    if (idx == -1)
      return

    component.off('change', this._onmarkerchange)
    component.marker = null

    this._markerComponents.splice(idx, 1)
    var removals = this._markers.splice(idx, 1)
  }

  get markers() {
    if (!this._markerComponents) {
      this._markerComponents = []
      this._markers = []
    }

    return this._markers
  }

  setElementProperties(div) {
    this.rescale()
  }

  onchange(after, before) {
    if (GoogleMap.loaded) {
      if (after.zoom)
        this.map.setZoom(after.zoom)

      if (after.hasOwnProperty('lat') || after.hasOwnProperty('lng')) {
        let {
          lat,
          lng
        } = this.model
        this.map.setCenter(new google.maps.LatLng(lat, lng));
      }
    }

    super.onchange(after, before)

    this.rescale()
  }

  get nature() {
    return NATURE;
  }
}

scene.Component.register('google-map', GoogleMap);

