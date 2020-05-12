import React, { useState } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { makeStyles } from "@material-ui/core";

import { getActivities } from "../api/strava";
import demoData from "../constants/DemoActivities";
import MyMap from "../components/MyMap";
import MySidebar from "../components/sidebar/MySidebar";
import { calcBounds } from "../utils";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
  },
}));

const Board = (props) => {
  const classes = useStyles();

  const { currentUser } = props;

  const [activities, setActivities] = useState(demoData);
  const [blackgroundActive, setBlackground] = useState(false);
  const [lineWeight, setLineWeight] = useState(3);
  const [lineColor, setLineColor] = useState("#0000ff"); //blue
  const [selectedColor, setSelectedColor] = useState("#52eb0e"); //neon green
  const [mapCenter, setMapCenter] = useState({ center: null });
  const [mapBounds, setMapBounds] = useState([]);
  const [selectedAct, setSelectedAct] = useState({});

  const handleSelectedAct = (newSelection) => {
    const prevSelect = _.find(activities, (activity) => activity.selected === true);
    if (prevSelect) prevSelect.selected = false;

    const selected = _.find(activities, (activity) => activity.id === newSelection.id);
    if (selected) {
      selected.selected = true;
    }

    const rideEl = document.getElementById(`row${newSelection.id}`);
    rideEl.scrollIntoView({
      behavior: "auto",
      block: "center",
      inline: "center",
    });


    const bounds = calcBounds(newSelection.points);

    setMapBounds(bounds);
    setSelectedAct(newSelection);
  };

  return (
    <div className={classes.root}>
      <MySidebar
        currentUser={currentUser}
        blackgroundActive={blackgroundActive}
        setBlackground={setBlackground}
        activities={activities}
        setActivities={setActivities}
        lineColor={lineColor}
        setLineColor={setLineColor}
        lineWeight={lineWeight}
        setLineWeight={setLineWeight}
        setMapCenter={setMapCenter}
        setSelectedColor={setSelectedColor}
        selectedColor={selectedColor}
        handleSelectedAct={handleSelectedAct}
        selectedAct={selectedAct}
      />
      <MyMap
        blackgroundActive={blackgroundActive}
        activities={activities}
        lineColor={lineColor}
        selectedColor={selectedColor}
        lineWeight={lineWeight}
        mapCenter={mapCenter}
        mapBounds={mapBounds}
        handleSelectedAct={handleSelectedAct}
      />
    </div>
  );
};

Board.propTypes = {
  // currentUser: PropTypes.obj
};

export default Board;
