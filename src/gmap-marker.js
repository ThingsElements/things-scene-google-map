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
    },
    {
      type: "number",
      label: "latitude",
      name: "lat",
      property: {
        step: 0.000001,
        max: 90,
        min: -90
      }
    },
    {
      type: "number",
      label: "longitude",
      name: "lng",
      property: {
        step: 0.000001,
        max: 180,
        min: -180
      }
    }
  ],
  "value-property": "latlng"
};

const MARKER_PATH =
  "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0";

export default class GMapMarker extends RectPath(Shape) {
  dispose() {
    this.marker && this.marker.setMap(null);

    this.marker = null;
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

  get infoWindow() {
    if (!this._infoWindow) this._infoWindow = new google.maps.InfoWindow();

    return this._infoWindow;
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

  setInfoContent(sceneInfoWindow) {
    var tpl = Component.template(sceneInfoWindow.model.frontSideTemplate);
    var content = `<style>${sceneInfoWindow.model.style}</style>` + tpl(this);

    this.infoWindow.setContent(content);
  }

  openInfoWindow(iw) {
    this.setInfoContent(iw);

    if (!this.map) return;

    this.infoWindow.open(this.map, this.marker);
  }

  onmarkerclick(e) {
    var iw = this.findInfoWindow("tap");
    iw && this.openInfoWindow(iw);

    this.trigger("click", e.ya);
  }

  onmarkermouseover(e) {
    var iw = this.findInfoWindow("hover");
    iw && this.openInfoWindow(iw);
  }

  onmarkermouseout(e) {
    var iw = this.findInfoWindow("hover");
    iw && this.infoWindow.close();
  }

  set marker(marker) {
    if (this._marker) {
      this._marker.setMap(null);
      google.maps.event.clearInstanceListeners(this._marker);

      delete this._marker;
    }

    if (marker) {
      marker.addListener("click", this.onmarkerclick.bind(this));
      marker.addListener("mouseover", this.onmarkermouseover.bind(this));
      marker.addListener("mouseout", this.onmarkermouseout.bind(this));

      this._marker = marker;
    }
  }

  get marker() {
    if (!this._marker && this.map) {
      let {
        lat,
        lng,
        fillStyle: fillColor,
        alpha: fillOpacity = 1,
        strokeStyle: strokeColor,
        lineWidth: strokeWeight
      } = this.state;

      var marker = new google.maps.Marker({
        position: {
          lat: Number(lat) || 0,
          lng: Number(lng) || 0
        },
        map: this.map,
        icon: {
          path: MARKER_PATH,
          fillColor,
          fillOpacity,
          strokeColor,
          strokeWeight
        }
      });

      this.marker = marker;
    }

    return this._marker;
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
              this.marker && this.marker.setMap(this.map);

              this.targetMap.off("change", listener);
            }
          };
          this.targetMap.on("change", listener);
        } else {
          this.marker && this.marker.setMap(this.map);
        }
      }
    }
  }

  get targetMap() {
    return this._targetMap;
  }

  // get click_handler() {
  //   if (!this._click_handler)
  //     this._click_handler = this.onmarkerclick.bind(this);

  //   return this._click_handler;
  // }

  onchange(after, before) {
    if ("targetMap" in after) {
      this.onchangeTargetMap();
    }

    if ("lat" in after || "lng" in after) {
      var { lat, lng } = this.state;
      this.latlng = {
        lat,
        lng
      };
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

  get latlng() {
    return {
      lat: this.getState("lat"),
      lng: this.getState("lng")
    };
  }

  set latlng(latlng) {
    var { lat, lng } = latlng;
    this.marker && this.marker.setPosition(new google.maps.LatLng(lat, lng));

    this.setState({
      lat,
      lng
    });
  }

  get nature() {
    return NATURE;
  }
}

Component.register("gmap-marker", GMapMarker);
