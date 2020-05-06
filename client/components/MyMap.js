import React from "react";
import { GoogleApiWrapper, Map, Polyline, Polygon } from "google-maps-react";
import { makeStyles } from "@material-ui/core";

import { blackground } from "../constants/map";

import config from "../../config/keys";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const MyMap = (props) => {
  const classes = useStyles();
  const { center, blackGroundActive } = props;

  return (
    <div>
      <Map
        id="mapcomp"
        containerStyle={{
          width: "calc(100% - 375px)",
          height: "calc(100% - 60px)",
        }}
        google={props.google}
        zoom={11} //higher number = closer zoom
        mapTypeId="satellite"
        center={center}
        initialCenter={{
          lat: 33.945602,
          lng: -118.483297,
        }}
      >
        {blackGroundActive && blackground}
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: config.mapsApi,
  libraries: ["geometry", "visualization"],
})(MyMap);
