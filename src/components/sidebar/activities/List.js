import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import { sidebarWidth } from "../../../constants/sidebar";
import { getDynamicHeight } from "../../../utils";
import Row from "./Row";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",

    maxWidth: sidebarWidth,
    overflowY: "scroll",
    backgroundColor: theme.palette.background.paper,
    transition: "width 1s",
  },
  rowSpacer: {
    height: 50,
  },
}));

export default function List(props) {
  const classes = useStyles();
  const { activities, loading } = props;

  let newHeight = 0;
  const [listHeight, setListHeight] = useState(newHeight);
  getDynamicHeight(setListHeight, loading);

  return (
    <div style={{ height: listHeight }} className={classes.root}>
      {activities.map((activity, index) => (
        <Row key={index} index={index} activity={activity} {...props} />
      ))}
      <div className={classes.rowSpacer} />
    </div>
  );
}

List.propTypes = {
  activities: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};
