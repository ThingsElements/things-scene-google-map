/*
 * Copyright © HatioLab Inc. All rights reserved.
 */

import { Component, RectPath, Shape } from "@hatiolab/things-scene";

const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties: [
    {
      type: "id-input",
      label: "target-map",
      name: "targetMap",
      property: {
        component: "google-map"
      }
    }
  ],
  "value-property": "latlngs"
};

const EMPTY_MARKER_PATH =
  "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z";
const END_MARKER_PATH =
  "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0";
const START_MARKER_PATH =
  "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z m -3,-34 l 0,8 l 8,-4 l -8,-4 z m -0,-0 l 0,8 l 8,-4 l -8,-4";

export default class GMapPath extends RectPath(Shape) {
  dispose() {
    this.markers && this.markers.forEach(marker => marker.setMap(null));

    this.markers = null;
    delete this._infoWindow;

    super.dispose();
  }

  ready() {
    super.ready();

    if (this.isTemplate()) {
      return;
    }

    this.onchangeTargetMap();
  }

  get map() {
    return this._map;
  }

  findInfoWindow(type) {
    var eventSetting = (this.state.event && this.state.event[type]) || {};

    var infoWindow =
      /* event spec v1.0 */ eventSetting.infoWindow ||
      /* event spec v1.1 */ (eventSetting.action == "infoWindow" &&
        eventSetting.target);

    if (infoWindow) {
      return this.root.findById(infoWindow);
    }
  }

  getInfoContent(sceneInfoWindow, index) {
    var tpl = Component.template(sceneInfoWindow.model.frontSideTemplate);
    return (
      `<style>${sceneInfoWindow.model.style}</style>` +
      tpl({
        data: this.data,
        index
      })
    );
  }

  openInfoWindow(iw, index) {
    var content = this.getInfoContent(iw, index);

    if (!this.map) return;

    var infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent(content);
    infoWindow.open(this.map, this.markers[index]);

    return infoWindow;
  }

  buildMarkers() {
    if (!this.map) {
      return;
    }

    let {
      latlngs = [],
      fillStyle: fillColor,
      alpha: fillOpacity = 1,
      strokeStyle: strokeColor,
      lineWidth: strokeWeight
    } = this.state;

    var markers = latlngs.map(
      ({ lat, lng }, index) =>
        new google.maps.Marker({
          position: {
            lat: Number(lat) || 0,
            lng: Number(lng) || 0
          },
          map: this.map,
          icon: {
            path:
              index == 0
                ? START_MARKER_PATH
                : index + 1 == latlngs.length
                ? END_MARKER_PATH
                : EMPTY_MARKER_PATH,
            fillColor,
            fillOpacity,
            strokeColor,
            strokeWeight
          },
          index
        })
    );

    this.trackPath = new google.maps.Polyline({
      path: latlngs,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1,
      strokeWeight: 4,
      map: this.map
    });

    var infowindows = new Array(markers.length);

    markers.forEach((marker, index) => {
      marker.addListener("click", () => {
        var iw = this.findInfoWindow("tap");
        iw && this.openInfoWindow(iw, index);

        this.trigger("click", e);
      });
      marker.addListener("mouseover", () => {
        var iw = this.findInfoWindow("hover");
        if (!iw) return;
        infowindows[index] = this.openInfoWindow(iw, index);
      });
      marker.addListener("mouseout", () => {
        var infowindow = infowindows[index];
        infowindow && infowindow.close();
        infowindows[index] = null;
      });
    });

    this.markers = markers;
  }

  set markers(markers) {
    if (this._markers) {
      this._markers.forEach(marker => {
        marker.setMap(null);
        google.maps.event.clearInstanceListeners(marker);
      });

      delete this._markers;
    }

    this._markers = markers;
  }

  get markers() {
    if (!this._markers) {
      this.buildMarkers();
    }

    return this._markers;
  }

  get trackPath() {
    return this._trackPath;
  }

  set trackPath(trackPath) {
    if (this.trackPath) {
      this.trackPath.setMap(null);
    }

    this._trackPath = trackPath;
  }

  get hidden() {
    return super.hidden || this.app.isViewMode;
  }

  set hidden(hidden) {
    super.hidden = hidden;
  }

  _draw(context) {
    var { top, left, width, height } = this.state;

    context.translate(left, top);

    // 마커 모양 그리기
    context.beginPath();

    context.moveTo(width / 2, height * 0.9);
    context.bezierCurveTo(
      width / 2.3,
      height * 0.6,
      0,
      height / 2,
      0,
      height / 4
    );

    context.ellipse(
      width / 2,
      height / 4,
      width / 2,
      height / 4,
      0,
      Math.PI * 1,
      Math.PI * 0
    );

    context.bezierCurveTo(
      width,
      height / 2,
      width / 1.7,
      height * 0.6,
      width / 2,
      height * 0.9
    );
    context.closePath();

    context.translate(-left, -top);
  }

  get controls() {}

  onchangeTargetMap() {
    if (this.targetMap) {
      this._targetMap = null;
      this._map = null;
    }

    var id = this.get("targetMap");
    if (id !== undefined) {
      this._targetMap = this.root.findById(id);

      if (this.targetMap) {
        this._map = this.targetMap.map;

        if (!this.map) {
          var listener = after => {
            if ("map" in after) {
              this._map = after.map;
              this.markers &&
                this.markers.forEach(marker => marker.setMap(this.map));

              this.targetMap.off("change", listener);
            }
          };
          this.targetMap.on("change", listener);
        } else {
          this.markers &&
            this.markers.forEach(marker => marker.setMap(this.map));
        }
      }
    }
  }

  get targetMap() {
    return this._targetMap;
  }

  onchange(after, before) {
    if ("targetMap" in after) {
      this.onchangeTargetMap();
    }

    if ("latlngs" in after) {
      this.buildMarkers();
    }

    if (
      ("fillStyle" in after ||
        "strokeStyle" in after ||
        "lineWidth" in after) &&
      this.marker
    ) {
      let {
        fillStyle: fillColor,
        alpha: fillOpacity = 1,
        strokeStyle: strokeColor,
        lineWidth: strokeWeight
      } = this.state;

      this.marker.setIcon({
        path: MARKER_PATH,
        fillColor,
        fillOpacity,
        strokeColor,
        strokeWeight
      });
    }

    super.onchange && super.onchange(after, before);
  }

  get latlngs() {
    return this.getState("latlngs");
  }

  set latlngs(latlngs) {
    this.setState({
      latlngs
    });
  }

  get nature() {
    return NATURE;
  }
}

Component.register("gmap-path", GMapPath);
