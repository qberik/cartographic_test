import L from "leaflet";
import "leaflet-groupedlayercontrol";

import { DEFAULT_POSITION } from "./constants";

import play_icon from "/play.svg";
import stop_icon from "/stop.svg";

export var map = L.map("map", {
  closePopupOnClick: false,
}).setView(DEFAULT_POSITION.center, DEFAULT_POSITION.zoom);

var map_layer = L.tileLayer(
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
).addTo(map);

export var metro4all = L.featureGroup({});
export var dc_wifi_social = L.featureGroup({});

var groupedOverlays = {
  Маркеры: {
    "portals.csv": metro4all,
    "bars.geojson": dc_wifi_social,
  },
};

L.Control.Button = L.Control.extend({
  options: {
    position: "topleft",
  },
  onAdd: function (map) {
    var container = L.DomUtil.create("div", "leaflet-bar leaflet-control");
    var button = L.DomUtil.create(
      "a",
      "leaflet-control-button presentaion-control-button relative",
      container
    );

    const play = button.appendChild(new Image());
    play.src = play_icon;
    play.classList.add(
      "absolute",
      "size-full",
      "p-1",
      "presentaion-control-button-icon"
    );

    const stop = button.appendChild(new Image());
    stop.src = stop_icon;
    stop.classList.add(
      "absolute",
      "size-full",
      "p-1",
      "hidden",
      "presentaion-control-button-icon"
    );

    container.title = "Presentaion toggle";
    return container;
  },
  onRemove: function (map) {},
});
var control = new L.Control.Button();
control.addTo(map);

L.control
  .groupedLayers({}, groupedOverlays, {
    exclusiveGroups: [Object.keys(groupedOverlays)[0]],
  })
  .addTo(map);

export function getFeatureGroupByName(name) {
  return Object.values(groupedOverlays)[0][name];
}

export function getActiveFeatureGroups() {
  return Object.values(Object.values(groupedOverlays)[0]).filter((f) => {
    return map.hasLayer(f);
  })[0];
}
