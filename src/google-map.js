/*
 * Copyright © HatioLab Inc. All rights reserved.
 */

const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties: [
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
        min: -180,
        max: 180
      }
    },
    {
      type: "number",
      label: "zoom",
      name: "zoom"
    },
    {
      type: "string",
      label: "api-key",
      name: "apiKey"
    }
  ],
  "value-property": "latlng"
};

import {
  Component,
  HTMLOverlayContainer,
  ScriptLoader,
  error
} from "@hatiolab/things-scene";

function getGlobalScale(component) {
  var scale = { x: 1, y: 1 };
  var parent = component;

  while (parent) {
    let { x, y } = parent.get("scale") || { x: 1, y: 1 };
    scale.x *= x || 1;
    scale.y *= y || 1;

    parent = parent.parent;
  }
  return scale;
}

export default class GoogleMap extends HTMLOverlayContainer {
  static load(component) {
    var key = component.get("apiKey");
    ScriptLoader.load(
      "https://maps.googleapis.com/maps/api/js" + (key ? "?key=" + key : "")
    ).then(() => component.onload(), error);
  }

  ready() {
    super.ready();

    if (this.rootModel) {
      this._listenTo = this.rootModel;
      this._listener = function(after) {
        after.scale && this.rescale();
      }.bind(this);
      this.rootModel.on("change", this._listener);
    }
  }

  removed() {
    if (this._listenTo) {
      this._listenTo.off("change", this._listener);

      delete this._listenTo;
      delete this._listener;
    }
  }

  /*
   * google map은 scale된 상태에서 마우스 포지션을 정확히 매핑하지 못하므로, 마커를 정상적으로 동작시키지 못한다.
   * 따라서, google map의 경우에는 부모의 스케일의 역으로 transform해서, scale을 1로 맞추어야 한다.
   */
  rescale() {
    var anchor = this._anchor;
    if (!anchor) return;
    var scale = getGlobalScale(this);

    var sx = 1 / scale.x;
    var sy = 1 / scale.y;

    var transform = `scale(${sx}, ${sy})`;

    ["-webkit-", "-moz-", "-ms-", "-o-", ""].forEach(prefix => {
      anchor.style[prefix + "transform"] = transform;
      anchor.style[prefix + "transform-origin"] = "0px 0px";
    });

    var { width, height } = this.state;
    anchor.style.width = width * scale.x + "px";
    anchor.style.height = height * scale.y + "px";

    if (GoogleMap.loaded) {
      google.maps.event.trigger(this.map, "resize");
      let { lat, lng } = this.state;
      this.map &&
        this.map.setCenter({
          lat,
          lng
        });
    }
  }

  createElement() {
    super.createElement();
    this._anchor = document.createElement("div");
    this.element.appendChild(this._anchor);
    this.rescale();

    GoogleMap.load(this);
  }

  onload() {
    GoogleMap.loaded = true;

    var { lat, lng, zoom } = this.state;

    try {
      this._map = new google.maps.Map(this._anchor, {
        zoom,
        center: new google.maps.LatLng(lat, lng)
      });
    } finally {
      /*
       * setState 로 map 객체가 생성되었음을 change 이벤트로 알려줄 수 있다
       * - set('map', this._map)으로 만들 지 않도록 주의한다.
       * - setState('map', this._map)으로해야 컴포넌트 모델에 추가되지 않는다.
       */
      this.setState("map", this._map);
      this.rescale();
    }
  }

  get tagName() {
    return "div";
  }

  get map() {
    return this._map;
  }

  dispose() {
    super.dispose();

    delete this._anchor;
  }

  setElementProperties(div) {
    this.rescale();
  }

  onchange(after, before) {
    if (GoogleMap.loaded) {
      if (after.zoom) this.map.setZoom(after.zoom);

      if ("lat" in after || "lng" in after) {
        let { lat, lng } = this.state;
        this.map.setCenter(new google.maps.LatLng(lat, lng));
      }
    }

    super.onchange(after, before);

    this.rescale();
  }

  get latlng() {
    return {
      lat: this.get("lat"),
      lng: this.get("lng")
    };
  }

  set latlng(latlng) {
    this.set(latlng);
  }

  get nature() {
    return NATURE;
  }
}

Component.register("google-map", GoogleMap);
