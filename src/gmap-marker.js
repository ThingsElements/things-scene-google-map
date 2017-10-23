/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
var {
  Component,
  RectPath,
  Shape
} = scene

const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties: [{
    type: 'string',
    label: 'target-map',
    name: 'targetMap',
    property: 'targetMap'
  }, {
    type: 'number',
    label: 'latitude',
    name: 'lat',
    property: 'lat'
  }, {
    type: 'number',
    label: 'longitude',
    name: 'lng',
    property: 'lng'
  }]
}

export default class GMapMarker extends RectPath(Shape) {

  dispose() {
    var map = this.findMap()
    map && map.removeMarker(this)

    delete this._marker

    super.dispose()
  }

  ready() {
    var map = this.findMap()
    map && map.addMarker(this)
  }

  onmarkerclick() {
    console.log('click...')
  }

  onmarkermouseover() {
    console.log('mouseover...')
  }

  onmarkermouseout() {
    console.log('mouseout...')
  }

  set marker(marker) {
    if(this._marker) {
      this._marker.setMap(null);
      google.maps.event.clearInstanceListeners(this._marker);

      delete this._marker
    }

    if(marker) {
      marker.addListener('click', this.onmarkerclick.bind(this))
      marker.addListener('mouseover', this.onmarkermouseover.bind(this))
      marker.addListener('mouseout', this.onmarkermouseout.bind(this))

      this._marker = marker
    }
  }

  _draw(context) {

    if(this.app.isViewMode)
      return

    var {
      top,
      left,
      width,
      height
    } = this.model;

    context.translate(left, top)

    // 마커 모양 그리기
    context.beginPath()

    context.moveTo(width / 2, height * 0.9)
    context.bezierCurveTo(width / 2.3, height * 0.6, 0, height / 2, 0, height / 4)

    context.ellipse(width / 2, height / 4, width / 2, height / 4, 0, Math.PI * 1, Math.PI * 0)

    context.bezierCurveTo(width, height / 2, width / 1.7, height * 0.6, width / 2, height * 0.9)

    context.closePath()

    this.drawFill(context)
    this.drawStroke(context)

    context.translate(-left, -top)
  }

  get controls() {}

  findMap(id) {
    id = id || this.get('targetMap')

    return id && this.root.findById(id)
  }

  get click_handler() {
    if(!this._click_handler)
      this._click_handler = this.onmarkerclick.bind(this)

    return this._click_handler
  }

  onchange(after, before) {
    if(before.targetMap) {
      var map = this.findMap(before.targetMap)
      map && map.removeMarker(this)
    }

    if(after.targetMap) {
      var map = this.findMap(after.targetMap)
      var marker = map && map.addMarker(this)
    }

    super.onchange && super.onchange(after, before)
  }

  get nature() {
    return NATURE
  }
}

Component.register('gmap-marker', GMapMarker)

