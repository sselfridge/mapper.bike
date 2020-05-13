import React from "react";
import PropTypes from "prop-types";
import { makeStyles, Button } from "@material-ui/core";
import config from "../../../config/keys";

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  stravaImg: {
    width: "99%",
  },
  demoBtn: {
    display: "flex",
    flexDirection: "column",
  },
  demoText: {
    textAlign: "center",
  },
}));

const DefaultSidebar = (props) => {
  const classes = useStyles();
  const { getDemoActivities } = props;

  return (
    <div className={classes.root}>
      <div>
        <a
          href={`https://www.strava.com/oauth/authorize?client_id=${config.client_id}&redirect_uri=${config.callback_uri}/api/strava/callback&response_type=code&approval_prompt=auto&scope=activity:read`}
        >
          <img className={classes.stravaImg} src="client/img/connectStrava.png" />
        </a>
        <section className={classes.demoText}>
          We will not share your data with anyone, delete yourself anytime from our{" "}
          <span title="As if there were more than one...there is not">servers</span>
        </section>
      </div>
      <div className={classes.demoBtn}>
        <section>Want to try it out without linking your Strava?</section>
        <Button id="demoBtn" variant={"contained"} onClick={getDemoActivities}>
          Click Here To Load Demo data
        </Button>
      </div>
    </div>
  );
};

DefaultSidebar.propTypes = {
  getDemoActivities: PropTypes.func,
};

export default DefaultSidebar;
