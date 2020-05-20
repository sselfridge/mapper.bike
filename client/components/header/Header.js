import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core";

import HeaderRight from "./HeaderRight";

// eslint-disable-next-line no-unused-vars
import { apiTest, getUser } from "../../api/strava";

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
const version = VERSION;

const Header = (props) => {
  const classes = useStyles();

  const testClick = () => {
    getUser(1075670)
      .then((result) => {
        console.log("getUser Result");
        console.log(result === undefined);
        console.log(result);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className={classes.root}>
      <button onClick={apiTest}>TEST</button>

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
  stravaLogout: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default Header;
