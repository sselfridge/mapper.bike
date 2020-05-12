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
