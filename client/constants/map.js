import React from "react";
import { Polygon } from "google-maps-react";

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


// prettier-ignore
export const lineColors = 
['#FF6900', '#FCB900', '#7BDCB5', '#52eb0e', '#8ED1FC', '#0693E3', '#0000ff',
 '#EB144C', '#F78DA7', '#9900EF']
