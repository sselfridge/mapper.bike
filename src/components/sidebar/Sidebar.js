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
  setCurrentUser: PropTypes.func.isRequired,
  blackgroundActive: PropTypes.bool.isRequired,
  setBlackground: PropTypes.func.isRequired,
  activities: PropTypes.array.isRequired,
  setActivities: PropTypes.func.isRequired,
  efforts: PropTypes.array.isRequired,
  setEfforts: PropTypes.func.isRequired,
  filteredEfforts: PropTypes.array.isRequired,
  setFilteredEfforts: PropTypes.func.isRequired,
  mapLines: PropTypes.array.isRequired,
  setMapLines: PropTypes.func.isRequired,
  lineColor: PropTypes.string.isRequired,
  setLineColor: PropTypes.func.isRequired,
  lineWeight: PropTypes.number.isRequired,
  setLineWeight: PropTypes.func.isRequired,
  setMapCenter: PropTypes.func.isRequired,
  setSelectedColor: PropTypes.func.isRequired,
  selectedColor: PropTypes.string.isRequired,
  handleSelected: PropTypes.func.isRequired,
  selectedAct: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
  handleRemoveLine: PropTypes.func.isRequired,
  snackBar: PropTypes.func.isRequired,
  rankColors: PropTypes.array.isRequired,
  setRankColors: PropTypes.func.isRequired,
  centerMapOnActivity: PropTypes.func.isRequired,
};

export default Sidebar;
