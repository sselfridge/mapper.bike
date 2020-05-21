import React, { useState } from "react";
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
// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles((theme) => ({
  root: {
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
    if (newSelection.points === undefined && newSelection.line)
      newSelection.points = decodePolyline(newSelection.line);
    const bounds = calcBounds(newSelection.points);

    setMapBounds(bounds);
    setTimeout(() => {
      setMapBounds([]);
    }, 0);
    setSelectedAct(newSelection);
  };

  const handleRemoveLine = (index) => {
    mapLines.splice(index, 1);
    setMapLines(mapLines.slice());
  };

  return (
    <div className={classes.root}>
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
      />
      <MyMap
        blackgroundActive={blackgroundActive}
        mapLines={mapLines}
        lineColor={lineColor}
        selectedColor={selectedColor}
        lineWeight={lineWeight}
        mapCenter={mapCenter}
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
