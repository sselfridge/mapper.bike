import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import dayjs from "../../utils/dayjs";
import { makeStyles } from "@material-ui/core";

import ReactLoading from "react-loading";

const useStyles = makeStyles((theme) => ({
  loadingText: {
    position: "relative",
    textAlign: "center",
    top: -150,
  },
}));

const calcDateDiff = (after, before) => {
  const diff = before - after;

  const days = Math.floor(diff / 86400);

  return days > 2000 ? "2000+" : days;
};

const secFromTimer = (timer) => {
  const diff = dayjs() - timer;
  return Math.floor(diff / 1000);
};

const showDots = (loadingDots) => {
  return ".".repeat(loadingDots);
};

const LoadingSpinner = (props) => {
  const classes = useStyles();
  const { loading, afterDate, beforeDate } = props;

  const [loadingTimer, setLoadingTimer] = useState(dayjs());
  const [loadingDots, setLoadingDots] = useState(3);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (loading && timeoutRef.current === null) {
      setLoadingTimer(dayjs());
      timeoutRef.current = setTimeout(() => {
        const dots = (loadingDots + 1) % 4;
        setLoadingDots(dots);
      }, 1000);
    }

    return () => {
      if (!loading) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [loading, loadingDots]);

  if (!loading) return null;

  return (
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
  );
};
LoadingSpinner.propTypes = {
  loading: PropTypes.bool.isRequired,
  afterDate: PropTypes.number.isRequired,
  beforeDate: PropTypes.number.isRequired,
};

export default LoadingSpinner;
