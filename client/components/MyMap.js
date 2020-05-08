import React from "react";
import { GoogleApiWrapper, Map, Polyline, Polygon } from "google-maps-react";
import { makeStyles } from "@material-ui/core";

import { blackground,sidebarWidth } from "../constants/map";

import config from "../../config/keys";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const MyMap = (props) => {
  const classes = useStyles();
  const { center, blackgroundActive } = props;

  return (
    <div>
      <Map
        id="mapcomp"
        containerStyle={{
          width: `calc(100% - ${sidebarWidth}px)`,
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
        {blackgroundActive && blackground}
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: config.mapsApi,
  libraries: ["geometry", "visualization"],
})(MyMap);
