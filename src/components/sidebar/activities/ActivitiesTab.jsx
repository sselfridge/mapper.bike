import React, { useRef, useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import dayjs from "../../../utils/dayjs";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  makeStyles,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { getActivities } from "../../../api/strava";
import List from "./List";
import { sideBarHeight } from "../../../constants/sidebar";

import ControlPanel from "./ControlPanel";
import LoadingSpinner from "../../shared/LoadingSpinner";

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
  const now = dayjs();
  const afterDate = now.subtract(2, "months").unix();
  return afterDate;
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

  const didMountRef = useRef(null);

  const [beforeDate, setBefore] = useState(dayjs().unix());
  const [afterDate, setAfter] = useState(calcAfterDate());
  const [panelExpanded, setPanelExpanded] = useState(true);
  const [activityType, setActivityType] = useState({
    Ride: true,
    VirtualRide: false,
    Run: false,
    Other: false,
  });

  /**
   * @param {Date} newDate - can be null or synthetic event
   */
  const onAfterChange = (newDate) => {
    if (newDate?.type) return; //user typing date, do nothing

    const defaultAfter = "1969-12-31T16:00:01-08:00";

    if (newDate === null && dayjs.unix(afterDate).format() === defaultAfter) {
      newDate = dayjs.unix(calcAfterDate()).format();
    }

    const after = dayjs(newDate || defaultAfter);
    const before = dayjs.unix(beforeDate);

    setAfter(after.unix());
    if (after.isAfter(before)) {
      setBefore(after.unix());
    }
  };
  /**
   * @param {Date} newDate - can be null or synthetic event
   */
  const onBeforeChange = (newDate) => {
    if (newDate?.type) return; //user typing date, do nothing

    const after = dayjs.unix(afterDate);
    const before = dayjs(newDate || dayjs().format());
    setBefore(before.unix());

    if (before.isBefore(after)) {
      setAfter(before.unix());
    }
  };

  const fetchActivities = useCallback(() => {
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
    if (didMountRef.current === null) {
      fetchActivities();
      didMountRef.current = true;
    }
  }, [fetchActivities]);

  return (
    <div className={classes.root}>
      <Accordion id="controlPanel" expanded={panelExpanded}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          onClick={() => setPanelExpanded((val) => !val)}
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
      <LoadingSpinner
        loading={loading}
        afterDate={afterDate}
        beforeDate={beforeDate}
      />
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
