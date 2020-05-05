import React, { useState, useEffect } from "react";
import { GoogleApiWrapper, Map, Polyline, Polygon } from "google-maps-react";
import config from "../../config/keys";

import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {},
  asdf: {
    backgroundColor: "red",
  },
}));

const MyMap = (props) => {
  const classes = useStyles();
  const { center } = props;

  return (
    <div>
      <Map
        id="mapcomp"
        containerStyle={{
          width: "calc(100% - 360px)",
          height: "calc(100% - 55px)",
        }}
        google={props.google}
        zoom={11} //higher number = closer zoom
        mapTypeId="satellite"
        center={center}
        initialCenter={{
          lat: 33.945602,
          lng: -118.483297,
        }}
      ></Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: config.mapsApi,
  libraries: ["geometry", "visualization"],
})(MyMap);
