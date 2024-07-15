declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*.png" {
  const content: any;
  export default content;
}

declare class MarkerProperty extends L.Layer {
  feature: { properties: { [key: string]: string } };
}

declare class MapState {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}
