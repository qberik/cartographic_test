import "./index.css";
import "leaflet/dist/leaflet.css";

import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.prototype.options.iconUrl = markerIconUrl;
L.Icon.Default.prototype.options.iconRetinaUrl = markerIconRetinaUrl;
L.Icon.Default.prototype.options.shadowUrl = markerShadowUrl;
L.Icon.Default.imagePath = "";

import { GEOJSON_FILE_URL, CSV_FILE_URL } from "./constants";
import { map, getFeatureGroupByName } from "./init";
import {
  getMapState,
  saveMapState,
  setMapPosition,
  getFilterText,
  getSelectedLayer,
  saveSelectedLayer,
} from "./state";
import { fetchGeoJson, fetchCSV } from "./fetchFiles";
import { filterMarkersByName, showMarker } from "./filter";
import { showMarkersOnTable } from "./table";
import {
  presentationStarted,
  togglePresentationButton,
} from "./presentaionMode";

const map_state = getMapState();
setMapPosition(map_state);

Promise.all([fetchGeoJson(GEOJSON_FILE_URL), fetchCSV(CSV_FILE_URL)]).then(
  () => {
    const saved_layer_name = getSelectedLayer();
    getFeatureGroupByName(saved_layer_name).addTo(map);

    document.getElementById("name_filter").value = getFilterText();
    filterMarkersByName(getFilterText());

    showMarkersOnTable();

    map.on("overlayadd", (e) => {
      saveSelectedLayer(e.name);
      if (presentationStarted) {
        togglePresentationButton();
      }

      getFeatureGroupByName(e.name)
        .getLayers()
        .map((f) => {
          showMarker(f);
        });
      filterMarkersByName(document.getElementById("name_filter").value);
      showMarkersOnTable();
      map.fitBounds(getFeatureGroupByName(e.name).getBounds());
    });

    map.on("zoom", () => {
      saveMapState();
    });

    map.on("move", () => {
      saveMapState();
    });
  }
);
