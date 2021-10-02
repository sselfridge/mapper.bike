import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core";

import HeaderRight from "./HeaderRight";

// eslint-disable-next-line no-unused-vars
import { apiTest, getUser, kickoffQ } from "../../api/strava";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    display: "flex",
    justifyContent: "space-between",
  },
  title: {
    fontSize: "2em",
    fontWeight: 800,
    marginLeft: "40%",
  },
  betaText: {
    fontSize: ".6em",
    color: "#FC4C02",
  },
  headerRight: {
    alignSelf: "flex-end",
  },
}));

// eslint-disable-next-line no-undef
const version = "";

const Header = (props) => {
  const classes = useStyles();

  const { currentUser } = props;

  const kickoff =
    currentUser.athleteId === 1075670 ? (
      <div>
        <button onClick={kickoffQ}>Start Q</button> <button onClick={apiTest}>TEST</button>
      </div>
    ) : (
      ""
    );
  return (
    <div className={classes.root}>
      {kickoff}
      <div className={classes.title}>
        Mapper.Bike <span className={classes.betaText}>beta {`v-${version}`}</span>
      </div>
      <div className={classes.headerRight}>
        <HeaderRight {...props} />
      </div>
    </div>
  );
};

Header.propTypes = {
  currentUser: PropTypes.object.isRequired,
};

export default Header;
