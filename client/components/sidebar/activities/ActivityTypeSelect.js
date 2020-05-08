import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import AllInclusiveRoundedIcon from "@material-ui/icons/AllInclusiveRounded";

const useStyles = makeStyles((theme) => ({
  activityType:{
    display: 'flex',
    
  },
  typeBtn: {
    margin: theme.spacing(0.5),
    border: 'none',
    // padding: theme.spacing(0, 1),
    '&:not(:first-child)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-child': {
      borderRadius: theme.shape.borderRadius,
    },
  },
  paper: {
    display: "flex",
    border: `1px solid ${theme.palette.divider}`,
    flexWrap: "wrap",
  },
  typeIcon: {
    height: 32,
    width: 32,
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

function ActivityTypeSelect() {
  const [alignment, setAlignment] = React.useState("left");
  const [formats, setFormats] = React.useState(() => ["italic"]);



  const onTypeChange = (e, newType) => {};

  const classes = useStyles();

  return (
    <div className={classes.activityType}>
      <div className={classes.typeBtn}>
        <img
          className={classes.typeIcon}
          src="./client/img/ride.png"
          title="Ride"
          onClick={() => onTypeChange("Ride")}
        />
      </div>
      <div className={classes.typeBtn}>
        <img
          className={classes.typeIcon}
          src="./client/img/trainer.png"
          title="Virtual Ride"
          onClick={() => onTypeChange("VirtualRide")}
        />
      </div>
      <div className={classes.typeBtn}>
        <img
          className={classes.typeIcon}
          src="./client/img/shoe.png"
          title="Run"
          onClick={() => onTypeChange("Run")}
        />
      </div>
      <div className={classes.typeBtn}>
        <AllInclusiveRoundedIcon title="All Other Activites" className={classes.typeIcon} />
      </div>
    </div>
  );
}

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
