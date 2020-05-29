import React, { useState, useEffect } from "react";
import Header from "../components/header/Header";
import Board from "./Board";
import SnackBar from "../components/SnackBar";
import { Paper, makeStyles } from "@material-ui/core";

import { NULL_USER, getCurrentUser, logout } from "../api/strava";

const useStyles = makeStyles((theme) => {
  // leaving these here in case the theme needs to be inspeced

  // console.log(theme.shape.borderRadius);
  // console.log(theme.spacing(1));
  // console.log(theme.spacing(1,1));
  // console.log(theme.spacing(1,1,1,1));

  return {
    root: {
      fontFamily: theme.typography.fontFamily,
    },
  };
});

const NewApp = () => {
  const classes = useStyles();

  const [currentUser, setCurrentUser] = useState(NULL_USER);
  const [snackBarMsg, setSnackBarMsg] = useState("");
  const [snackBarType, setSnackBarType] = useState("info");

  function snackBar(msg, type = "info") {
    setSnackBarMsg(msg);
    setSnackBarType(type);
  }

  const stravaLogout = () => {
    logout().then(() => {
      setCurrentUser(NULL_USER);
    });
  };

  //Fetch User Data
  useEffect(() => {
    getCurrentUser()
      .then((response) => {
        if (response.status === 200) setCurrentUser(response.data);
      })
      .catch(() => {
        //TODO - server doesn't throw errors just returns 201
      });
  }, []);

  return (
    <Paper className={classes.root}>
      <Header currentUser={currentUser} stravaLogout={stravaLogout} />
      <Board currentUser={currentUser} snackBar={snackBar} setCurrentUser={setCurrentUser} />
      <SnackBar
        snackBarMsg={snackBarMsg}
        snackBarType={snackBarType}
        setSnackBarMsg={setSnackBarMsg}
      />
    </Paper>
  );
};

export default NewApp;
