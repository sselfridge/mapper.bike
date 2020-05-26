import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "87.5vh",
    backgroundColor: theme.palette.background,
    padding: theme.spacing(1),
  },
}));

const UserAgreement = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div>
        <h2>Premium Paywall</h2>
        <p>
          Due to the way Strava&apos;s API is now, I can only get segment rank information for
          Premium Strava users.
        </p>
        <p>You&apos;ll need to upgrade your strava account in order to take advantage of this.</p>
      </div>
    </div>
  );
};

UserAgreement.propTypes = {
  userAgreed: PropTypes.bool.isRequired,
  setUserAgreed: PropTypes.func.isRequired,
};

export default UserAgreement;
