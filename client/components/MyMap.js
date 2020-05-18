import React from "react";
import PropTypes from "prop-types";
import { GoogleApiWrapper, Map, Polyline } from "google-maps-react";
import { makeStyles } from "@material-ui/core";
import decodePolyline from "decode-google-map-polyline";

import { sidebarWidth } from "../constants/sidebar";
import { blackground } from "../constants/map";

import config from "../../config/keys";

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles((theme) => ({
  root: {},
}));

const MyMap = (props) => {
  const classes = useStyles();
  const {
    mapCenter,
    blackgroundActive,
    mapLines,
    lineColor,
    lineWeight,
    selectedColor,
    mapBounds,
    handleSelected,
  } = props;

  const lines = [];
  mapLines.forEach((mapLine) => {
    if (!mapLine.line) return;

    const newLine = (
      <Polyline
        key={mapLine.id}
        path={decodePolyline(mapLine.line)}
        strokeColor={mapLine.selected ? selectedColor : lineColor}
        strokeWeight={mapLine.selected ? lineWeight + 2 : lineWeight}
        strokeOpacity={0.75}
        zIndex={mapLine.selected ? 90 : 2}
        onClick={() => {
          handleSelected(mapLine, "map");
        }}
      />
    );
    lines.push(newLine);
  });

  let bounds;
  if (mapBounds.length > 0) {
    bounds = new props.google.maps.LatLngBounds();
    for (var i = 0; i < mapBounds.length; i++) {
      bounds.extend(mapBounds[i]);
    }
  }

  return (
    <div className={classes.root}>
      <Map
        id="mapcomp"
        containerStyle={{
          width: `calc(100% - ${sidebarWidth}px)`,
          height: "calc(100% - 60px)",
        }}
        google={props.google}
        zoom={11} //higher number = closer zoom
        mapTypeId="satellite"
        center={mapCenter}
        bounds={bounds}
        initialCenter={{
          lat: 33.945602,
          lng: -118.483297,
        }}
      >
        {blackgroundActive && blackground}
        {lines}
      </Map>
    </div>
  );
};

MyMap.propTypes = {
  mapCenter: PropTypes.object.isRequired,
  blackgroundActive: PropTypes.bool.isRequired,
  mapLines: PropTypes.array.isRequired,
  lineColor: PropTypes.string.isRequired,
  lineWeight: PropTypes.number.isRequired,
  selectedColor: PropTypes.string.isRequired,
  mapBounds: PropTypes.array.isRequired,
  handleSelected: PropTypes.func.isRequired,
  google: PropTypes.object.isRequired,
};

export default GoogleApiWrapper({
  apiKey: config.mapsApi,
  libraries: ["geometry", "visualization"],
})(MyMap);
