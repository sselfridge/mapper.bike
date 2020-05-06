import axios from "axios";
import config from "../../config/keys";

export function centerOnLocation(value) {
  return new Promise((resolve, reject) => {
    const address = encodeURIComponent(value);
    const GOOGLE_API = "https://maps.google.com/maps/api/geocode/json";
    let url = GOOGLE_API + `?key=${config.mapsApi}` + `&address=${address}`;
    axios
      .get(url)
      .then((response) => {
        if (response.data.status === "ZERO_RESULTS") {
          return resolve({ center: null });
        }
        const { lat, lng } = response.data.results[0].geometry.location;
        return resolve({
          center: {
            lat,
            lng,
          },
        });
      })
      .catch((error) => {
        console.error(error);
        return reject("Error with location - try another query");
      });
  });
}
