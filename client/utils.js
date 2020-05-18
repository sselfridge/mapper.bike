import { headerAndTabHeight, loadingSpinnerHeight } from "./constants/sidebar";

export const calcBounds = (points) => {
  let maxLat = Number.MIN_SAFE_INTEGER;
  let maxLng = Number.MIN_SAFE_INTEGER;
  let minLat = Number.MAX_SAFE_INTEGER;
  let minLng = Number.MAX_SAFE_INTEGER;

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    if (point.lat > maxLat) maxLat = point.lat;
    if (point.lng > maxLng) maxLng = point.lng;
    if (point.lat < minLat) minLat = point.lat;
    if (point.lng < minLng) minLng = point.lng;
  }

  const bounds = [
    { lat: maxLat, lng: maxLng },
    { lat: minLat, lng: minLng },
  ];

  return bounds;
};

export const getDynamicHeight = (setListHeight, loading) => {
  const panel = document.getElementById("controlPanel");

  if (panel) {
    setTimeout(() => {
      const panelHeight = panel.offsetHeight;
      const windowHeight = window.innerHeight;
      const newHeight = windowHeight - (headerAndTabHeight + panelHeight);
      const heightWithLoading = loading ? newHeight - loadingSpinnerHeight : newHeight;
      setListHeight(heightWithLoading);
    }, 250);
  }
};

export const noKeyOverLap = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  console.log(process.env);

  keys1.forEach((key) => {
    if (keys2.indexOf(key) !== -1) throw new Error(`Obj overlap! key:${key}`);
  });
};
