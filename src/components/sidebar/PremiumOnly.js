import React from "react";
// import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core";
import { sideBarHeight } from "../../constants/sidebar";
const useStyles = makeStyles((theme) => ({
  root: {
    height: sideBarHeight,
    backgroundColor: theme.palette.background,
    padding: theme.spacing(1),
  },
}));

const PremiumOnly = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div>
        <h2>Premium Paywall</h2>
        <p>
          Due to the way Strava&apos;s API is now, I can only get segment rank information for
          Premium users or subscription, or whatever they&apos;re calling it this month.
        </p>
        <p>You&apos;ll need to upgrade your strava account in order to take advantage of this.</p>
      </div>
    </div>
  );
};

export default PremiumOnly;
