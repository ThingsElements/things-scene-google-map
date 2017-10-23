(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _get=function get(object,property,receiver){if(object===null)object=Function.prototype;var desc=Object.getOwnPropertyDescriptor(object,property);if(desc===undefined){var parent=Object.getPrototypeOf(object);if(parent===null){return undefined}else{return get(parent,property,receiver)}}else if("value"in desc){return desc.value}else{var getter=desc.get;if(getter===undefined){return undefined}return getter.call(receiver)}};function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}return call&&(typeof call==="object"||typeof call==="function")?call:self}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass)}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass}var _scene=scene,Component=_scene.Component,RectPath=_scene.RectPath,Shape=_scene.Shape;var NATURE={mutable:false,resizable:true,rotatable:true,properties:[{type:"string",label:"target-map",name:"targetMap",property:"targetMap"},{type:"number",label:"latitude",name:"lat",property:"lat"},{type:"number",label:"longitude",name:"lng",property:"lng"}]};var GMapMarker=function(_RectPath){_inherits(GMapMarker,_RectPath);function GMapMarker(){_classCallCheck(this,GMapMarker);return _possibleConstructorReturn(this,(GMapMarker.__proto__||Object.getPrototypeOf(GMapMarker)).apply(this,arguments))}_createClass(GMapMarker,[{key:"dispose",value:function dispose(){var map=this.findMap();map&&map.removeMarker(this);_get(GMapMarker.prototype.__proto__||Object.getPrototypeOf(GMapMarker.prototype),"dispose",this).call(this)}},{key:"ready",value:function ready(){var map=this.findMap();map&&map.addMarker(this)}},{key:"_draw",value:function _draw(context){if(this.app.isViewMode)return;var _model=this.model,top=_model.top,left=_model.left,width=_model.width,height=_model.height;context.translate(left,top);context.beginPath();context.moveTo(width/2,height*.9);context.bezierCurveTo(width/2.3,height*.6,0,height/2,0,height/4);context.ellipse(width/2,height/4,width/2,height/4,0,Math.PI*1,Math.PI*0);context.bezierCurveTo(width,height/2,width/1.7,height*.6,width/2,height*.9);context.closePath();this.drawFill(context);this.drawStroke(context);context.translate(-left,-top)}},{key:"findMap",value:function findMap(id){id=id||this.get("targetMap");return id&&this.root.findById(id)}},{key:"onchange",value:function onchange(after,before){if(before.targetMap){var map=this.findMap(before.targetMap);map&&map.removeMarker(this)}if(after.targetMap){var map=this.findMap(after.targetMap);map&&map.addMarker(this)}_get(GMapMarker.prototype.__proto__||Object.getPrototypeOf(GMapMarker.prototype),"onchange",this)&&_get(GMapMarker.prototype.__proto__||Object.getPrototypeOf(GMapMarker.prototype),"onchange",this).call(this,after,before)}},{key:"controls",get:function get(){}},{key:"nature",get:function get(){return NATURE}}]);return GMapMarker}(RectPath(Shape));exports.default=GMapMarker;Component.register("gmap-marker",GMapMarker)},{}],2:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _get=function get(object,property,receiver){if(object===null)object=Function.prototype;var desc=Object.getOwnPropertyDescriptor(object,property);if(desc===undefined){var parent=Object.getPrototypeOf(object);if(parent===null){return undefined}else{return get(parent,property,receiver)}}else if("value"in desc){return desc.value}else{var getter=desc.get;if(getter===undefined){return undefined}return getter.call(receiver)}};function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}return call&&(typeof call==="object"||typeof call==="function")?call:self}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass)}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass}var NATURE={mutable:false,resizable:true,rotatable:true,properties:[{type:"number",label:"latitude",name:"lat",property:"lat"},{type:"number",label:"longitude",name:"lng",property:"lng"},{type:"number",label:"zoom",name:"zoom",property:"zoom"},{type:"string",label:"api-key",name:"apiKey",property:"apiKey"}]};var _scene=scene,HTMLOverlayContainer=_scene.HTMLOverlayContainer;var GoogleMap=function(_HTMLOverlayContainer){_inherits(GoogleMap,_HTMLOverlayContainer);function GoogleMap(){_classCallCheck(this,GoogleMap);return _possibleConstructorReturn(this,(GoogleMap.__proto__||Object.getPrototypeOf(GoogleMap)).apply(this,arguments))}_createClass(GoogleMap,[{key:"createElement",value:function createElement(){_get(GoogleMap.prototype.__proto__||Object.getPrototypeOf(GoogleMap.prototype),"createElement",this).call(this);this._markerComponents=[];this._markers=[];this._onmarkerchange=this.onmarkerchange.bind(this);GoogleMap.load(this)}},{key:"onload",value:function onload(){var _this2=this;var map=this.map;this.buildMarkers();setTimeout(function(){google.maps.event.trigger(_this2.map,"resize")},1)}},{key:"dispose",value:function dispose(){var _this3=this;this._markerComponents&&this._markerComponents.slice().forEach(function(component){_this3.removeMarker(component)});delete this._markerComponents;delete this._markers;_get(GoogleMap.prototype.__proto__||Object.getPrototypeOf(GoogleMap.prototype),"dispose",this).call(this)}},{key:"buildMarkers",value:function buildMarkers(){var _this4=this;var markers=[];this._markerComponents.forEach(function(component){var _component$model=component.model,lat=_component$model.lat,lng=_component$model.lng;markers.push(new google.maps.Marker({position:{lat:lat,lng:lng},map:_this4.map}))});this._markers=markers}},{key:"refreshMarkers",value:function refreshMarkers(){var markers=this._markers;if(!GoogleMap.loaded)return;this._markerComponents.forEach(function(component,idx){var marker=markers[idx];var _component$model2=component.model,lat=_component$model2.lat,lng=_component$model2.lng;marker.setPosition(new google.maps.LatLng(lat,lng))})}},{key:"touchMarker",value:function touchMarker(component){var idx=this._markerComponents.indexOf(component);if(idx==-1||!GoogleMap.loaded)return;var marker=this._markers[idx];var _component$model3=component.model,lat=_component$model3.lat,lng=_component$model3.lng;marker.setPosition(new google.maps.LatLng(lat,lng))}},{key:"onmarkerchange",value:function onmarkerchange(after,before,hint){var component=hint.origin;if(after.hasOwnProperty("lat")||after.hasOwnProperty("lng"))this.touchMarker(component)}},{key:"addMarker",value:function addMarker(component){var markerComponents=this._markerComponents;var markers=this._markers;if(markerComponents.indexOf(component)==-1){markerComponents.push(component);component.on("change",this._onmarkerchange);if(!GoogleMap.loaded)return;var _component$model4=component.model,lat=_component$model4.lat,lng=_component$model4.lng;markers.push(new google.maps.Marker({position:{lat:lat,lng:lng},map:this.map}))}}},{key:"removeMarker",value:function removeMarker(component){var idx=this._markerComponents.indexOf(component);if(idx==-1)return;component.off("change",this._onmarkerchange);this._markerComponents.splice(idx,1);var marker=this._markers.splice(idx,1);marker&&marker[0]&&marker[0].setMap(null)}},{key:"setElementProperties",value:function setElementProperties(div){var _this5=this;if(GoogleMap.loaded){setTimeout(function(){google.maps.event.trigger(_this5.map,"resize")},1)}}},{key:"onchange",value:function onchange(after,before){if(GoogleMap.loaded){if(after.zoom)this.map.setZoom(after.zoom);if(after.hasOwnProperty("lat")||after.hasOwnProperty("lng")){var _model=this.model,lat=_model.lat,lng=_model.lng;this.map.setCenter(new google.maps.LatLng(lat,lng))}}_get(GoogleMap.prototype.__proto__||Object.getPrototypeOf(GoogleMap.prototype),"onchange",this).call(this,after,before)}},{key:"tagName",get:function get(){return"div"}},{key:"map",get:function get(){if(!this._map){var _model2=this.model,lat=_model2.lat,lng=_model2.lng,zoom=_model2.zoom;this._map=new google.maps.Map(this.element,{zoom:zoom,center:{lat:lat,lng:lng}})}return this._map}},{key:"markers",get:function get(){if(!this._markerComponents){this._markerComponents=[];this._markers=[]}return this._markers}},{key:"nature",get:function get(){return NATURE}}],[{key:"load",value:function load(component){if(GoogleMap.loaded){component.onload();return}if(this.script){GoogleMap.readies.push(component);return}this.readies=[component];var script=document.createElement("script");script.onload=function(){GoogleMap.loaded=true;GoogleMap.readies.forEach(function(component){return component.onload()});delete GoogleMap.readies};var key=component.get("apiKey");script.src="https://maps.googleapis.com/maps/api/js"+(key?"?key="+key:"");document.head.appendChild(script);GoogleMap.script=script}}]);return GoogleMap}(HTMLOverlayContainer);exports.default=GoogleMap;scene.Component.register("google-map",GoogleMap)},{}],3:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _googleMap=require("./google-map");Object.defineProperty(exports,"GoogleMap",{enumerable:true,get:function get(){return _interopRequireDefault(_googleMap).default}});var _gmapMarker=require("./gmap-marker");Object.defineProperty(exports,"GMapMarker",{enumerable:true,get:function get(){return _interopRequireDefault(_gmapMarker).default}});function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}},{"./gmap-marker":1,"./google-map":2}]},{},[3]);