import "./index.css";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";

import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.prototype.options.iconUrl = markerIconUrl;
L.Icon.Default.prototype.options.iconRetinaUrl = markerIconRetinaUrl;
L.Icon.Default.prototype.options.shadowUrl = markerShadowUrl;
L.Icon.Default.imagePath = "";

import { GEOJSON_FILE_URL, CSV_FILE_URL } from "./constants";
import { map, getFeatureGroupByName } from "./initMap";
import {
  getMapState,
  saveMapState,
  setMapPosition,
  getFilterText,
  saveFilterText,
  getSelectedLayer,
  saveSelectedLayer,
} from "./state";
import { fetchGeoJson, fetchCSV } from "./fetchFiles";
import { filterMarkersByName, showMarker } from "./filter";
import { showMarkersOnTable } from "./table";
import {
  presentationStarted,
  togglePresentationButton,
} from "./presentationMode";

function initializeEventListeners() {
  document
    .getElementsByClassName("presentation-control-button")[0]
    .addEventListener("click", togglePresentationButton);

  const nameFilterInput = document.getElementById(
    "name_filter"
  ) as HTMLInputElement;

  nameFilterInput.addEventListener("keydown", () => {
    if (presentationStarted) {
      togglePresentationButton();
    }
  });

  nameFilterInput.addEventListener("input", (e: InputEvent) => {
    const inputValue = (e.target as HTMLInputElement).value;
    saveFilterText(inputValue);
    filterMarkersByName(inputValue);
    showMarkersOnTable();
  });
}

async function loadData() {
  const mapState = getMapState();
  setMapPosition(mapState);

  await Promise.all([fetchGeoJson(GEOJSON_FILE_URL), fetchCSV(CSV_FILE_URL)]);

  const savedLayerName = getSelectedLayer();
  const selectedLayer = getFeatureGroupByName(savedLayerName);

  selectedLayer.addTo(map);

  const nameFilterInput = document.getElementById(
    "name_filter"
  ) as HTMLInputElement;
  nameFilterInput.value = getFilterText();
  filterMarkersByName(getFilterText());
  showMarkersOnTable();

  map.on("overlayadd", (e) => {
    saveSelectedLayer(e.name);
    if (presentationStarted) {
      togglePresentationButton();
    }

    const featureGroup = getFeatureGroupByName(e.name);
    featureGroup.getLayers().forEach(showMarker);

    filterMarkersByName(nameFilterInput.value);
    showMarkersOnTable();
    map.fitBounds(featureGroup.getBounds());
  });

  map.on("zoom", saveMapState);
  map.on("move", saveMapState);
}

function main() {
  initializeEventListeners();

  loadData();
}

main();
