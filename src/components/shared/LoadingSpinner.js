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

const LoadingSpinner = (props) => {
  const classes = useStyles();
  const { loading, afterDate, beforeDate } = props;

  const [seconds, setSeconds] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (loading && timeoutRef.current === null) {
      const timeZero = dayjs();

      timeoutRef.current = setInterval(() => {
        const newSeconds = secFromTimer(timeZero);
        setSeconds(newSeconds);
      }, 1000);
    }

    return () => {
      if (!loading) {
        clearInterval(timeoutRef.current);
        timeoutRef.current = null;
        setSeconds(0);
      }
    };
  }, [loading, setSeconds]);

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
        <div>{`${seconds} secs elapsed`}</div>
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
