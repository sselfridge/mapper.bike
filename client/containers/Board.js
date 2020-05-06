import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";

import MyMap from "../components/MyMap";
import MySidebar from "../components/MySidebar";

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

  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={classes.root}>
      <MySidebar currentUser={currentUser} activeTab={activeTab} setActiveTab={setActiveTab} />
      <MyMap />
    </div>
  );
};

export default Board;
