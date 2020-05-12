import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import { sidebarWidth } from "../../../constants/map";
import Row from "./Row";

import demoData from "../../../constants/DemoActivities";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",

    maxWidth: sidebarWidth,
    overflowY: "scroll",
    backgroundColor: theme.palette.background.paper,
    transition: "width 1s",
  },
}));

const getDynamicHeight = (setListHeight) => {
  const panel = document.getElementById("controlPanel");

  if (panel) {
    setTimeout(() => {
      const panelHeight = panel.offsetHeight;
      const windowHeight = window.innerHeight;
      const newHeight = windowHeight - (120 + panelHeight);
      setListHeight(newHeight);
    }, 250);
  }
};

export default function List(props) {
  const classes = useStyles();
  const { activities } = props;

  let newHeight = 0;
  const [listHeight, setListHeight] = useState(newHeight);
  getDynamicHeight(setListHeight);

  const [selected, setSelected] = useState(-1);

  return (
    <div style={{ height: listHeight }} className={classes.root}>
      {activities.map((activity, index) => (
        <Row
          key={index}
          index={index}
          activity={activity}
          selected={selected}
          setSelected={setSelected}
        />
      ))}
    </div>
  );
}
