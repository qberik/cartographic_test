import { getActiveFeatureGroups } from "./initMap";
import * as L from "leaflet";

export function filterMarkersByName(name: string) {
  const features = getActiveFeatureGroups().getLayers();

  features.map((f) => {
    const props: { [key: string]: string } = (<MarkerProperty>f).feature
      .properties;
    if (
      // Проверяется name и name_ru
      (props.name && props.name.includes(name)) ||
      (props.name_ru && props.name_ru.includes(name))
    ) {
      showMarker(f);
    } else {
      hideMarker(f);
    }
  });
}

export function isMarkerHidden(f: L.Layer) {
  return (<any>f)._icon.style.display == "none";
}

function hideMarker(f: L.Layer) {
  (<L.Marker>f).setOpacity(0);
  (<any>f)._icon.style.display = "none";
}

export function showMarker(f: L.Layer) {
  (<L.Marker>f).setOpacity(100);
  (<any>f)._icon.style.display = "block";
}
