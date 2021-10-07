import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { makeStyles } from "@material-ui/core";

// import demoData from "../constants/DemoActivities";
import MyMap from "../components/MyMap";
import Sidebar from "../components/sidebar/Sidebar";
import decodePolyline from "decode-google-map-polyline";

import { calcBounds } from "../utils";
// eslint-disable-next-line no-unused-vars
import demoEfforts from "../constants/DemoEfforts";
import { effortColors } from "../constants/map";
import { NULL_USER } from "../api/strava";

import { centerOnLocation } from "../api/google.js";

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles((theme) => ({
  BoardRoot: {
    display: "flex",
    flexDirection: "row",
  },
}));

const Board = (props) => {
  const classes = useStyles();

  const { currentUser, setCurrentUser, snackBar } = props;

  const [mapLines, setMapLines] = useState([]);
  const [activities, setActivities] = useState([]);
  const [efforts, setEfforts] = useState([]);
  const [filteredEfforts, setFilteredEfforts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [blackgroundActive, setBlackground] = useState(false);
  const [lineWeight, setLineWeight] = useState(3);
  const [lineColor, setLineColor] = useState("#0000ff"); //blue
  const [selectedColor, setSelectedColor] = useState("#52eb0e"); //neon green
  const [rankColors, setRankColors] = useState(effortColors.slice());
  const [mapCenter, setMapCenter] = useState({ center: null });
  const [mapZoom, setMapZoom] = useState(4);
  const [mapBounds, setMapBounds] = useState([]);
  const [selectedAct, setSelectedAct] = useState({});

  const handleSelected = (newSelection, source) => {
    const prevSelect = _.find(mapLines, (line) => line.selected === true);
    if (prevSelect) prevSelect.selected = false;

    if (newSelection.id === selectedAct.id) {
      setSelectedAct({});
      return;
    }

    const selected = _.find(mapLines, (line) => line.id === newSelection.id);
    if (selected) {
      selected.selected = true;
    }

    if (source === "map") {
      const rideEl = document.getElementById(`row${newSelection.id}`);
      rideEl.scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "center",
      });
    }

    setSelectedAct(newSelection);
  };

  const centerMapOnActivity = (activity) => {
    if (activity.points === undefined && activity.line)
      activity.points = decodePolyline(activity.line);

    const bounds = calcBounds(activity.points);
    setMapBounds(bounds);
    setTimeout(() => {
      setMapBounds([]);
    }, 0);
  };

  const handleRemoveLine = (id, variant) => {
    if (variant === "activity") {
      const newActivities = activities.filter((act) => act.id !== id);
      setActivities(newActivities);
    } else {
      const newEfforts = efforts.filter((effort) => effort.id !== id);
      setEfforts(newEfforts);
    }

    //TODO this isn't removing the ride from the list
    // setMapLines(newMapLines);
  };

  useEffect(() => {
    if (currentUser === NULL_USER) {
      setActivities([]);
      setEfforts([]);
      setMapLines([]);
    }
    if (currentUser !== NULL_USER) {
      centerOnLocation(`${currentUser.city}, ${currentUser.state}`).then(
        (result) => {
          if (result.center.lat) {
            setMapCenter(result.center);
            setMapZoom(12);
          }
        }
      );
    }
  }, [currentUser]);

  return (
    <div className={classes.BoardRoot}>
      <Sidebar
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        blackgroundActive={blackgroundActive}
        setBlackground={setBlackground}
        activities={activities}
        setActivities={setActivities}
        efforts={efforts}
        setEfforts={setEfforts}
        filteredEfforts={filteredEfforts}
        setFilteredEfforts={setFilteredEfforts}
        mapLines={mapLines}
        setMapLines={setMapLines}
        lineColor={lineColor}
        setLineColor={setLineColor}
        lineWeight={lineWeight}
        setLineWeight={setLineWeight}
        setMapCenter={setMapCenter}
        setSelectedColor={setSelectedColor}
        selectedColor={selectedColor}
        handleSelected={handleSelected}
        selectedAct={selectedAct}
        loading={loading}
        setLoading={setLoading}
        handleRemoveLine={handleRemoveLine}
        snackBar={snackBar}
        rankColors={rankColors}
        setRankColors={setRankColors}
        centerMapOnActivity={centerMapOnActivity}
      />
      <MyMap
        blackgroundActive={blackgroundActive}
        mapLines={mapLines}
        lineColor={lineColor}
        selectedColor={selectedColor}
        lineWeight={lineWeight}
        mapCenter={mapCenter}
        mapZoom={mapZoom}
        mapBounds={mapBounds}
        handleSelected={handleSelected}
        snackBar={snackBar}
        rankColors={rankColors}
      />
    </div>
  );
};

Board.propTypes = {
  currentUser: PropTypes.object,
  setCurrentUser: PropTypes.func,
  snackBar: PropTypes.func,
};

export default Board;
