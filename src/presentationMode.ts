import { map, getActiveFeatureGroups } from "./initMap";
import { isMarkerHidden } from "./filter";
import { PRESENTAION_SWITCH_DELAY } from "./constants";

export let presentationStarted: boolean;

async function startPresentation() {
  if (!presentationStarted) {
    map.dragging.disable();
    map.scrollWheelZoom.disable();
    map.doubleClickZoom.disable();

    presentationStarted = true;
    let funcs = Promise.resolve();

    const features = getActiveFeatureGroups().getLayers();

    features.forEach((feature: L.Layer) => {
      if (!isMarkerHidden(feature)) {
        funcs = funcs.then(() => {
          if (!presentationStarted) {
            throw new Error();
          }
          feature.openPopup();
          map.setView((<L.Marker>feature).getLatLng(), 15);
          return new Promise((r) => setTimeout(r, PRESENTAION_SWITCH_DELAY));
        });
      }
    });

    funcs
      .then(() => {
        togglePresentationButton();
      })
      .catch((e) => {});

    try {
      await funcs;
    } catch (e) {
      console.log(e);
    }
  }
}

function stopPresentaion() {
  map.dragging.enable();
  map.closePopup();
  map.scrollWheelZoom.enable();
  map.doubleClickZoom.enable();
  presentationStarted = false;
}

export function togglePresentationButton() {
  Array.from(
    document.getElementsByClassName("presentaion-control-button-icon")
  ).map((i) => {
    i.classList.toggle("hidden");
  });
  presentationStarted ? stopPresentaion() : startPresentation();
}
