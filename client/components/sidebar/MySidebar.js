import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";

import MyDefaultSidebar from "./MyDefaultSidebar";
import TabbedSidebar from "./TabbedSidebar";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 355,
    // overflow: "hidden",
  },
}));

const MySidebar = (props) => {
  const classes = useStyles();
  const { currentUser, getDemoActivities } = props;
  

  const sidebar = currentUser.firstname ? (
    <TabbedSidebar {...props} />
  ) : (
    <MyDefaultSidebar getDemoActivities={getDemoActivities} />
  );

  return <div className={classes.root}>{sidebar}</div>;
};

export default MySidebar;
