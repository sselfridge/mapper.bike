import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles, Tooltip } from "@material-ui/core/";

import AllInclusiveRoundedIcon from "@material-ui/icons/AllInclusiveRounded";

const useStyles = makeStyles((theme) => ({
  activityType: {
    display: "flex",
    flexDirection: "column",
  },
  typeBtn: {
    border: "1px solid black",
    backgroundColor: "lightgray",
    padding: theme.spacing(0, 1),
  },
  bottomTypeRow: {
    display: "flex",
    "& :first-child": {
      borderRadius: "0px 0px 0px 15px",
    },
    "& :last-child": {
      borderRadius: "0px 0px 15px 0px",
    },
  },
  topTypeRow: {
    display: "flex",
    "& :first-child": {
      borderRadius: "15px 0px 0px 0px",
    },
    "& :last-child": {
      borderRadius: "0px 15px 0px 0px",
    },
  },
  paper: {
    display: "flex",
    border: `1px solid ${theme.palette.divider}`,
    flexWrap: "wrap",
  },
  typeIcon: {
    height: theme.spacing(1) * 3.5,
    width: theme.spacing(1) * 3.5,
  },
  selectedIcon: {
    backgroundColor: "darkgray",
  },
}));

function ActivityTypeSelect(props) {
  const { toggleActivityType, activityType } = props;

  const classes = useStyles();

  return (
    <div className={classes.activityType}>
      <div className={classes.topTypeRow}>
        <div
          className={clsx(classes.typeBtn, {
            [classes.selectedIcon]: activityType.Ride,
          })}
        >
          <Tooltip title="Ride">
            <img
              className={classes.typeIcon}
              src="img/ride.png"
              onClick={() => toggleActivityType("Ride")}
              alt="Ride"
            />
          </Tooltip>
        </div>
        <div
          className={clsx(classes.typeBtn, {
            [classes.selectedIcon]: activityType.VirtualRide,
          })}
        >
          <Tooltip title="Virtual Ride">
            <img
              className={classes.typeIcon}
              src="img/trainer.png"
              onClick={() => toggleActivityType("VirtualRide")}
              alt="Virtual Ride"
            />
          </Tooltip>
        </div>
      </div>
      <aside className={classes.bottomTypeRow}>
        <div
          className={clsx(classes.typeBtn, {
            [classes.selectedIcon]: activityType.Run,
          })}
        >
          <Tooltip title="Run">
            <img
              className={classes.typeIcon}
              src="img/shoe.png"
              onClick={() => toggleActivityType("Run")}
              alt="Run"
            />
          </Tooltip>
        </div>
        <div
          className={clsx(classes.typeBtn, {
            [classes.selectedIcon]: activityType.Other,
          })}
        >
          <Tooltip title="All Other Types">
            <AllInclusiveRoundedIcon
              className={classes.typeIcon}
              onClick={() => toggleActivityType("Other")}
            />
          </Tooltip>
        </div>
      </aside>
    </div>
  );
}

ActivityTypeSelect.propTypes = {
  activityType: PropTypes.shape({
    Run: PropTypes.bool,
    VirtualRide: PropTypes.bool,
    Other: PropTypes.bool,
    Ride: PropTypes.bool,
  }),
  toggleActivityType: PropTypes.func,
};

export default ActivityTypeSelect;
