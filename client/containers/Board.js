import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";

import { getActivities } from "../api/strava";

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

  const [activities, setActivities] = useState([]);
  const [blackgroundActive, setBlackground] = useState(false);
  const [lineWeight, setLineWeight] = useState(3);
  const [lineColor, setLineColor] = useState("blue");
  const [mapCenter,setMapCenter] = useState({center:null})

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
