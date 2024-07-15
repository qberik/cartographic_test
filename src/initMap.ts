import * as L from "leaflet";
import "leaflet-groupedlayercontrol";

import { DEFAULT_POSITION } from "./constants";

import play_icon from "./public/play.svg";
import stop_icon from "./public/stop.svg";

export var map = L.map("map", {
  closePopupOnClick: false,
}).setView(DEFAULT_POSITION.center, DEFAULT_POSITION.zoom);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

export const metro4all = L.featureGroup();
export const dc_wifi_social = L.featureGroup();

const groupedOverlays: {
  [key: string]: { [key: string]: L.FeatureGroup<any> };
} = {
  Маркеры: {
    "portals.csv": metro4all,
    "bars.geojson": dc_wifi_social,
  },
};

const PresentationButton = L.Control.extend({
  options: {
    position: "topleft",
  },
  onAdd: function () {
    var container = L.DomUtil.create("div", "leaflet-bar leaflet-control");
    var button = L.DomUtil.create(
      "a",
      "leaflet-control-button presentation-control-button relative",
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
  onRemove: function () {},
});
var control = new PresentationButton();
control.addTo(map);

L.control
  .groupedLayers({}, groupedOverlays, {
    exclusiveGroups: [Object.keys(groupedOverlays)[0]],
  })
  .addTo(map);

export function getFeatureGroupByName(name: string) {
  return Object.values(groupedOverlays)[0][
    <keyof typeof groupedOverlays.Маркеры>name
  ];
}

export function getActiveFeatureGroups() {
  return Object.values(Object.values(groupedOverlays)[0]).filter((f) => {
    return map.hasLayer(f);
  })[0];
}
