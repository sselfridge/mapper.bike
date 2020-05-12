import React from "react";
import { Polyline, Polygon } from "google-maps-react";

export const sidebarWidth = 360;

//create blackground polygon:
export const blackground = [
  <Polygon
    paths={[
      { lat: 89, lng: -179 },
      { lat: 89, lng: 1 },
      { lat: -60, lng: 1 },
      { lat: -60, lng: -179 },
      { lat: 89, lng: -179 },
    ]}
    key="blackground0"
    fillColor="black"
    fillOpacity={1}
    clickable={false}
    zIndex={-99}
    visible={true}
  />,
  <Polygon
    paths={[
      { lat: 89, lng: -180 },
      { lat: 89, lng: 1 },
      { lat: -60, lng: 1 },
      { lat: -60, lng: -180 },
      { lat: 89, lng: -180 },
    ]}
    key="blackground1"
    fillColor="black"
    fillOpacity={1}
    clickable={false}
    zIndex={-99}
    visible={true}
  />,
];

// export const lineColors = [
//   "red",  "#e91e63",  "#9c27b0",  "#673ab7",  "blue",  "#2196f3",
//   "#03a9f4",  "#00bcd4",  "#009688",  "#4caf50",  "#8bc34a",  "#52eb0e",
//   "#ffeb3b",  "#ffc107",  "#ff9800",  "#ff5722",  "#795548",  "#607d8b",
// ];

// prettier-ignore
export const lineColors = 
['#FF6900', '#FCB900', '#7BDCB5', '#52eb0e', '#8ED1FC', '#0693E3', '#0000ff',
 '#EB144C', '#F78DA7', '#9900EF']
