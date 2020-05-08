import React, { useState } from "react";
import PropTypes from 'prop-types'
import { makeStyles } from "@material-ui/core";

import {getActivities} from '../api/strava';

import MyMap from "../components/MyMap";
import MySidebar from "../components/sidebar/MySidebar";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
  },
}));

const Board = (props) => {
  const classes = useStyles();

  const { currentUser } = props;

  const [activities, setActivities] = useState([]);
  


  return (
    <div className={classes.root}>
      <MySidebar
        currentUser={currentUser}
        activities={activities}
        setActivities={setActivities}
      />
      <MyMap activities={activities} />
    </div>
  );
};

Board.propTypes ={
  // currentUser: PropTypes.obj
}

export default Board;
