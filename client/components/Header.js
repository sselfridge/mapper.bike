import React from "react";
import HeaderRight from "./HeaderRight";
import { makeStyles, createStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => {
  console.log("theme");
  console.log(theme);

  return {
    root: {
      backgroundColor: theme.palette.primary.main,
      display: "flex",
      justifyContent: "space-between",
    },
  };
});

// eslint-disable-next-line no-undef
const version = VERSION;

const Header = (props) => {
  const classes = useStyles();

    console.log("Header Props");
    console.log(props);

  return (
    <div className={classes.root}>
      <div id="title">
        Mapper.Bike <span id="betatext">beta {`v-${version}`}</span>
      </div>
      <HeaderRight className={classes.headerRight} currentUser={props.currentUser} />
    </div>
  );
};

export default Header;
