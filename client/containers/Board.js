import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";

import { getActivities } from "../api/strava";
import demoData from "../constants/DemoActivities";
import MyMap from "../components/MyMap";
import MySidebar from "../components/sidebar/MySidebar";

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
  const [selectedId, setSelectedId] = useState(-1);

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
      />
      <MyMap
        blackgroundActive={blackgroundActive}
        activities={activities}
        lineColor={lineColor}
        lineWeight={lineWeight}
        mapCenter={mapCenter}
      />
    </div>
  );
};

Board.propTypes = {
  // currentUser: PropTypes.obj
};

export default Board;
