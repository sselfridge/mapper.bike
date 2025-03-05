import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import { sidebarWidth } from "../../../constants/sidebar";
import { getDynamicHeight } from "../../../utils";
import Row from "./Row";

const useStyles = makeStyles((theme) => ({
  List: {
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
  const { filteredEfforts, loading, panelExpanded } = props;

  const [listHeight, setListHeight] = useState(0);
  const setHeight = useCallback(() => {
    getDynamicHeight(setListHeight, loading);
  }, [loading]);

  useEffect(() => {
    setHeight();

    window.addEventListener("resize", setHeight);
    return () => {
      window.removeEventListener("resize", setHeight);
    };
  }, [setHeight, panelExpanded]);

  return (
    <div style={{ height: listHeight }} className={classes.List}>
      {filteredEfforts.map((effort, index) => (
        <Row key={index} index={index} effort={effort} {...props} />
      ))}
      <div className={classes.rowSpacer} />
    </div>
  );
}

List.propTypes = {
  filteredEfforts: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};
