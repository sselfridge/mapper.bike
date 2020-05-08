import React from "react";
import PropTypes from "prop-types";
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

  console.log("y sidebar props");
  console.log(props);

  const sidebar = currentUser.firstname ? (
    <TabbedSidebar {...props} />
  ) : (
    <MyDefaultSidebar getDemoActivities={getDemoActivities} />
  );

  return <div className={classes.root}>{sidebar}</div>;
};

MySidebar.propTypes = {
  getDemoActivities: PropTypes.func,
  currentUser: PropTypes.shape({
    firstname: PropTypes.string,
  }),
};

export default MySidebar;
