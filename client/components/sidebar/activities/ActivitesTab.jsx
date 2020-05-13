import React, { useState } from "react";
import PropTypes from 'prop-types'
import { makeStyles } from "@material-ui/core/styles";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
} from "@material-ui/core";
import ReactLoading from "react-loading";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { getActivities } from "../../../api/strava";
import List from "./List";

import ControlPanel from "./controlPanel";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "87.5vh",
    backgroundColor: "#aadaff",
    // padding: theme.spacing(1),
  },
  loadingText: {
    position: "relative",
    textAlign: "center",
    top: -150,
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

  const {
    setActivities,
    activities,
    handleSelectedAct,
    selectedAct,
    setMapCenter,
    setLoading,
    loading,
    handleRemoveActivity,
    snackBar
  } = props;

  const [beforeDate, setBefore] = useState(new Date());
  const [afterDate, setAfter] = useState(calcAfterDate());
  const [panelExpanded, setPanelExpanded] = useState(true);
  const [loadingTimer, setLoadingTimer] = useState(0);
  const [activityType, setActivityType] = useState({
    Ride: true,
    VirtualRide: false,
    Run: false,
    Other: false,
  });

  const onAfterChange = (newDate) => setAfter(newDate);
  const onBeforeChange = (newDate) => setBefore(newDate);

  function fetchActivities() {
    setLoadingTimer(0);
    setLoading(true);

    getActivities(activityType, afterDate, beforeDate)
      .then((result) => {
        setActivities(result);
      })
      .catch((err) => {
        console.error("Get Activites Error:", err);
        snackBar()
      })
      .finally(() => {
        setLoading(false)
      });
  }

  if (loading === true) {
    setTimeout(() => {
      setLoadingTimer(loadingTimer + 1);
    }, 1000);
  }

  return (
    <div className={classes.root}>
      <ExpansionPanel id="controlPanel" expanded={panelExpanded}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          onClick={() => setPanelExpanded(!panelExpanded)}
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
      {loading && (
        <div>
          <ReactLoading type="spinningBubbles" color="#FC4C02" width="100%" height={"300px"} />
          <div className={classes.loadingText}>
            <div>Loading....</div>
            <div>Allow ~5 seconds for every 200 activities</div>
            <div>{`${loadingTimer} secs elapsed`}</div>
          </div>
        </div>
      )}
      <List
        activities={activities}
        panelExpanded={panelExpanded}
        handleSelectedAct={handleSelectedAct}
        selectedAct={selectedAct}
        setMapCenter={setMapCenter}
        handleRemoveActivity={handleRemoveActivity}
      />
    </div>
  );
}

ActivitiesTab.propTypes = {
  activities: PropTypes.array.isRequired,
  setActivities: PropTypes.func.isRequired,
  handleSelectedAct: PropTypes.func.isRequired,
  selectedAct: PropTypes.object.isRequired,
  setMapCenter: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  handleRemoveActivity: PropTypes.func.isRequired,
  snackBar: PropTypes.func.isRequired,
};
