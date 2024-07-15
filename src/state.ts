import { DEFAULT_POSITION, DEFAULT_LAYER } from "./constants";
import { map } from "./initMap";

export function getMapPosition() {
  return { center: map.getCenter(), zoom: map.getZoom() };
}

export function setMapPosition(map_state: MapState) {
  const { center, zoom } = map_state;
  map.setView(center, zoom);
}

export function getMapState(): MapState {
  return JSON.parse(localStorage.getItem("map_position")) || DEFAULT_POSITION;
}

export function saveMapState() {
  localStorage.setItem(
    "map_position",
    JSON.stringify({ center: map.getCenter(), zoom: map.getZoom() })
  );
}

export function getSelectedLayer(): string {
  return localStorage.getItem("selected_layer") || DEFAULT_LAYER;
}

export function saveSelectedLayer(layer_index: string) {
  localStorage.setItem("selected_layer", layer_index);
}

export function getFilterText() {
  return localStorage.getItem("filter_text") || "";
}

export function saveFilterText(filter_text: string) {
  localStorage.setItem("filter_text", filter_text);
}
