import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";

import DefaultSidebar from "./DefaultSidebar";
import TabbedSidebar from "./TabbedSidebar";
import { sidebarWidth } from "../../constants/sidebar";

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles((theme) => ({
  root: {
    width: sidebarWidth,
    // overflow: "hidden",
  },
}));

const Sidebar = (props) => {
  const classes = useStyles();
  const { currentUser } = props;

  const sidebar = currentUser.firstname ? (
    <TabbedSidebar {...props} />
  ) : (
    <DefaultSidebar {...props} />
  );

  return <div className={classes.root}>{sidebar}</div>;
};

Sidebar.propTypes = {
  currentUser: PropTypes.shape({
    firstname: PropTypes.string,
  }),
};

export default Sidebar;
