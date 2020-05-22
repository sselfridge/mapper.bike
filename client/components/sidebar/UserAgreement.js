import React, { useState } from "react";
import PropTypes from "prop-types";

import { makeStyles, Checkbox, Button, FormControlLabel } from "@material-ui/core";
import { initializeUser } from "../../api/strava";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "87.5vh",
    backgroundColor: theme.palette.background,
    padding: theme.spacing(1),
  },
  checkbox: {
    display: "flex",
    justifyContent: "center",
  },
}));

const UserAgreement = (props) => {
  const classes = useStyles();

  const { userAgreed, setUserAgreed } = props;

  const [btnDisabled, setBtnDisabled] = useState(true);
  const [totalActivities, setTotalActivites] = useState(0);

  const handleAgreeClick = () => {
    setUserAgreed(true);
    initializeUser().then((response) => {
      setTotalActivites(response.data);
    });
  };

  return (
    <div className={classes.root}>
      {userAgreed ? (
        <div>
          <h2>Thanks!</h2>
          <p>
            Check back here soon! Processing time is dependant on how many rides and segments
            you&apos;ve done, but should be done in a few hours.
          </p>
          {totalActivities !== 0 && (
            <p>Currently Processing all {`${totalActivities}`} of your activities</p>
          )}
        </div>
      ) : (
        <div>
          <h2>User Agreement</h2>
          <p>
            In order to map your top 10 segments we will need to store some of your data. This
            won&apos;t be share with anyone and you can delete it at anytime.
          </p>
          <p>
            Because of Strava API rate limits, it can take a few hours to gather and sort through
            all your ride data.
          </p>
          <p>
            This feature is still in development, currently segments are shown as your scored them
            when riding, not current standing.
          </p>
          <p>In progress, but not implmemented yet:</p>
          <ul>
            <li>Update score to current standing</li>
            <li>Show Segments that were created after you rode them</li>
          </ul>
          <div className={classes.checkbox}>
            <FormControlLabel
              control={<Checkbox color="primary" onChange={() => setBtnDisabled(!btnDisabled)} />}
              label="I Agree"
            />
            <Button
              onClick={handleAgreeClick}
              variant={"contained"}
              color="primary"
              disabled={btnDisabled}
            >
              Start my Segment Search
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

UserAgreement.propTypes = {
  userAgreed: PropTypes.bool,
  setUserAgreed: PropTypes.func,
};

export default UserAgreement;
