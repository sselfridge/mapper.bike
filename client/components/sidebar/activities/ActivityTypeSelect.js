import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles, Tooltip } from "@material-ui/core/";

import AllInclusiveRoundedIcon from "@material-ui/icons/AllInclusiveRounded";

const useStyles = makeStyles((theme) => ({
  activityType: {
    display: "flex",
    flexDirection: 'column',
    "& :first-child": {
      borderRadius: "15px 0px 0px 15px",
    },
    "& :last-child": {
      borderRadius: "0px 15px 15px 0px",
    },
  },
  typeBtn: {
    border: "1px solid black",
    backgroundColor: "lightgray",
    padding: theme.spacing(0, 1),
  },
  typeRow: {
    display: 'flex'
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

// const StyledToggleButtonGroup = withStyles((theme) => ({
//   grouped: {
// margin: theme.spacing(0.5),
// border: 'none',
// padding: theme.spacing(0, 1),
// '&:not(:first-child)': {
//   borderRadius: theme.shape.borderRadius,
// },
// '&:first-child': {
//   borderRadius: theme.shape.borderRadius,
// },
//   },
// }))(ToggleButtonGroup);

function ActivityTypeSelect(props) {
  const { toggleActivityType, activityType } = props;

  const classes = useStyles();

  return (
    <div className={classes.activityType}>

      <div className={classes.typeRow}>
        <div className={clsx(classes.typeBtn, { [classes.selectedIcon]: activityType.Ride })}>
          <Tooltip title="Ride">
            <img
              className={classes.typeIcon}
              src="./client/img/ride.png"
              onClick={() => toggleActivityType("Ride")}
            />
          </Tooltip>
        </div>
        <div className={clsx(classes.typeBtn, { [classes.selectedIcon]: activityType.VirtualRide })}>
          <Tooltip title="Virtual Ride">
            <img
              className={classes.typeIcon}
              src="./client/img/trainer.png"
              onClick={() => toggleActivityType("VirtualRide")}
            />
          </Tooltip>
        </div>
      </div>
      <aside className={classes.typeRow}>
        <div className={clsx(classes.typeBtn, { [classes.selectedIcon]: activityType.Run })}>
          <Tooltip title="Run">
            <img
              className={classes.typeIcon}
              src="./client/img/shoe.png"
              onClick={() => toggleActivityType("Run")}
            />
          </Tooltip>
        </div>
        <div className={clsx(classes.typeBtn, { [classes.selectedIcon]: activityType.Other })}>
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

// <div id="activityType">
// <AllInclusiveRoundedIcon title="All Other Activites" className={classes.typeIcon} />
// <div id="typeRide">
//   <img
//     className={classes.typeIcon}
//     src="./client/img/ride.png"
//     title="Ride"
//     onClick={() => onTypeChange("Ride")}
//   />
// </div>
// <div id="typeVirtualRide">
//   <img
//     className={classes.typeIcon}
//     src="./client/img/trainer.png"
//     title="Virtual Ride"
//     onClick={() => onTypeChange("VirtualRide")}
//   />
// </div>
// <div id="typeRun">
//   <img
//     className={classes.typeIcon}
//     src="./client/img/shoe.png"
//     title="Run"
//     onClick={() => onTypeChange("Run")}
//   />
// </div>
// </div>
