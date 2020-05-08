import React from 'react'
import { makeStyles } from "@material-ui/core";

import MyDefaultSidebar from "./MyDefaultSidebar";
import TabbedSidebar from "./TabbedSidebar";
import { sidebarWidth } from "../../constants/map";

const useStyles = makeStyles((theme) => ({
  root: {
    width: sidebarWidth,
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
