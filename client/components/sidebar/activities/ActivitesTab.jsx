import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
} from "@material-ui/core";
import { getActivities } from "../../../api/strava";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


import ControlPanel from "./controlPanel";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "87.5vh",
    backgroundColor: "#aadaff",
    // padding: theme.spacing(1),
  },
}));

const calcAfterDate = () => {
  const now = new Date();
  const afterDate = new Date();
  afterDate.setMonth(now.getMonth() - 2);
  return afterDate;
};

export default function ActivitiesTab(props) {
  const classes = useStyles();

  // console.log("props");
  // console.log(props);

  const { setActivities } = props;

  const [beforeDate, setBefore] = useState(new Date());
  const [afterDate, setAfter] = useState(calcAfterDate());
  const [activityType, setActivityType] = useState({
    Ride: true,
    VirtualRide: true,
    Run: false,
    Other: false,
  });

  const onAfterChange = (newDate) => setAfter(newDate);
  const onBeforeChange = (newDate) => setBefore(newDate);

  function fetchActivities() {
    getActivities(activityType, afterDate, beforeDate)
      .then((result) => {
        setActivities(result);
      })
      .catch((err) => {
        console.error("Get Activites Error:", err);
        //TODO - snackbar msg
      });
  }

  return (
    <div className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Map Filter / Controls</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <ControlPanel
            fetchActivities={fetchActivities}
            afterDate={afterDate}
            beforeDate={beforeDate}
            onAfterChange={onAfterChange}
            onBeforeChange={onBeforeChange}
            activityType={activityType}
            setActivityType={setActivityType}
            {...props}
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}
