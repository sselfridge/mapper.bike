import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  makeStyles,
} from "@material-ui/core";
import ReactLoading from "react-loading";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { getActivities } from "../../../api/strava";
import List from "./List";
import { sideBarHeight } from "../../../constants/sidebar";

import ControlPanel from "./ControlPanel";

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles((theme) => ({
  root: {
    height: sideBarHeight,
    backgroundColor: theme.palette.background,
  },
  panelDetails: {
    padding: 0,
  },
  fillerText: {
    textAlign: "center",
  },
  loadingText: {
    position: "relative",
    textAlign: "center",
    top: -150,
  },
  panelSummary: {
    display: "flex",
    justifyContent: "space-between",
    flexGrow: 1,
  },
}));

const calcAfterDate = () => {
  const now = new Date();
  const afterDate = new Date();
  afterDate.setMonth(now.getMonth() - 2);
  return afterDate;
};

const calcDateDiff = (after, before) => {
  if (before === null) before = new Date();
  const diff = before - after;
  const days = Math.floor(diff / 86400000);
  return days > 2000 ? "2000+" : days;
};

const secFromTimer = (timer) => {
  const diff = moment() - timer;
  return Math.floor(diff / 1000);
};

const showDots = (loadingDots) => {
  return ".".repeat(loadingDots);
};

export default function ActivitiesTab(props) {
  const classes = useStyles();

  const {
    setActivities,
    activities,
    handleSelected,
    selectedAct,
    setMapCenter,
    setLoading,
    loading,
    handleRemoveLine,
    centerMapOnActivity,
    snackBar,
    currentUser: { athleteId },
  } = props;

  const [beforeDate, setBefore] = useState(new Date());
  const [afterDate, setAfter] = useState(calcAfterDate());
  const [panelExpanded, setPanelExpanded] = useState(true);
  const [loadingTimer, setLoadingTimer] = useState(moment());
  const [loadingDots, setLoadingDots] = useState(3);
  const [activityType, setActivityType] = useState({
    Ride: true,
    VirtualRide: false,
    Run: false,
    Other: false,
  });

  const onAfterChange = (newDate) => {
    setAfter(newDate);
    const after = moment(newDate);
    const before = moment(beforeDate);
    if (after.isAfter(before)) {
      setBefore(newDate);
    }
  };
  const onBeforeChange = (newDate) => {
    setBefore(newDate);
    const after = moment(afterDate);
    const before = moment(newDate);
    if (before.isBefore(after)) {
      setAfter(newDate);
    }
  };

  const fetchActivities = useCallback(() => {
    setLoadingTimer(moment());
    setLoading(true);

    //dont' fetch if using demo user
    if (athleteId === 101) return;
    console.log("athleteId: ", athleteId);

    getActivities(activityType, afterDate, beforeDate)
      .then((result) => {
        setActivities(result);
      })
      .catch((err) => {
        console.error("Get Activities Error:", err);
        snackBar("Error getting Rides, try again later", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    activityType,
    afterDate,
    beforeDate,
    setActivities,
    setLoading,
    snackBar,
    athleteId,
  ]);

  useEffect(() => {
    fetchActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading === true) {
    setTimeout(() => {
      const dots = (loadingDots + 1) % 4;
      setLoadingDots(dots);
    }, 1000);
  }

  return (
    <div className={classes.root}>
      <Accordion id="controlPanel" expanded={panelExpanded}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          onClick={() => setPanelExpanded(!panelExpanded)}
        >
          <div className={classes.panelSummary}>
            <Typography variant="h6">Control Panel</Typography>
            <Typography className={classes.headingInfo}>
              {activities.length} rides on map
            </Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails classes={{ root: classes.panelDetails }}>
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
        </AccordionDetails>
      </Accordion>
      {loading && (
        <div>
          <ReactLoading
            type="spinningBubbles"
            color="#FC4C02"
            width="100%"
            height={"300px"}
          />
          <div className={classes.loadingText}>
            <div>Fetching from Strava...</div>
            <div></div>
            <div>{`Your search covers ${calcDateDiff(
              afterDate,
              beforeDate
            )} days`}</div>
            <div>{`${secFromTimer(loadingTimer)} secs elapsed`}</div>
            <div>{`${showDots(loadingDots)}`}</div>
          </div>
        </div>
      )}
      {!activities[0] && !loading && (
        <div className={classes.fillerText}>
          {"Click 'GET RIDES' to populate map"}
        </div>
      )}
      <List
        activities={activities}
        loading={loading}
        panelExpanded={panelExpanded}
        handleSelected={handleSelected}
        selectedAct={selectedAct}
        setMapCenter={setMapCenter}
        handleRemoveLine={handleRemoveLine}
        centerMapOnActivity={centerMapOnActivity}
      />
    </div>
  );
}

ActivitiesTab.propTypes = {
  activities: PropTypes.array.isRequired,
  setActivities: PropTypes.func.isRequired,
  handleSelected: PropTypes.func.isRequired,
  selectedAct: PropTypes.object.isRequired,
  setMapCenter: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  handleRemoveLine: PropTypes.func.isRequired,
  snackBar: PropTypes.func.isRequired,
};
