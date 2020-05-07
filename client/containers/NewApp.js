import React, { useState, useEffect } from "react";
import Header from "../components/header/Header";
import Board from "./Board";
import { Paper, makeStyles } from "@material-ui/core";

import { NULL_USER, getCurrentUser, logout } from "../api/strava";

const useStyles = makeStyles((theme) => {
  
  console.log('App Theme');
  console.log(theme.palette);
  
  return ({
  root: {
    fontFamily: theme.typography.fontFamily
  },
})}
);




const NewApp = (props) => {
  const classes = useStyles();

  const [currentUser, setCurrentUser] = useState(NULL_USER);


  const stravaLogout = ()=>{
    logout().then(()=>{
      setCurrentUser(NULL_USER)
    });
  }

  //Fetch Data
  useEffect(() => {
    getCurrentUser().then((data) => {
      setCurrentUser(data);
    });
  }, []);

  return (
    <Paper className={classes.root}>
      <Header currentUser={currentUser} stravaLogout={stravaLogout} />
      <Board currentUser={currentUser} />
    </Paper>
  );
};

export default NewApp;
