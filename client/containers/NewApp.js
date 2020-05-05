import React, { useState, useEffect } from "react";
import Header from '../components/Header'
import Board from './Board'
import { Paper, makeStyles } from "@material-ui/core";

import { NULL_USER, getCurrentUser } from "../api/strava";


const useStyles = makeStyles(theme =>({
  root :{}
}))


const NewApp = (props) => {
  const classes = useStyles();

  const [currentUser, setCurrentUser] = useState(NULL_USER);


  //Fetch Data
  useEffect(() => {
    getCurrentUser().then((data) => {
      setCurrentUser(data);
    });
  }, []);

  return (
    <Paper>
      <Header currentUser={currentUser}/>
      <Board />
    </Paper>
  );
};

export default NewApp;