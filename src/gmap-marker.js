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
    var map = findMap()
    map && map.removeMarker(this)

    super.dispose()
  }

  ready() {
    var map = this.findMap()
    map && map.addMarker(this)
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

  onchange(after, before) {
    if(before.targetMap) {
      var map = this.findMap(before.targetMap)
      map && map.removeMarker(this)
    }
    if(after.targetMap) {
      var map = this.findMap(after.targetMap)
      map && map.addMarker(this)
    }

    super.onchange(after, before)
  }

  get nature() {
    return NATURE
  }
}

Component.register('gmap-marker', GMapMarker)
