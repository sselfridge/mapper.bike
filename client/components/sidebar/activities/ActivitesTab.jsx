import React, { useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import DatePicker from "react-date-picker";
import _ from "lodash";
import { Switch, Button } from "@material-ui/core";

import { getActivities, apiTest } from "../../../api/strava";

import InputLabel from "../../styledMui/InputLabel";
import ActivityTypeSelect from "./ActivityTypeSelect";
import LineOptions from "./LineOptions";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "87.5vh",
    backgroundColor: "#aadaff",
    // padding: theme.spacing(1),
  },
  datePicker: {
    width: 20,
  },
  date: {
    width: 150,
  },
  datePicking: {
    display: "flex",
    // margin: theme.spacing(1, 0),
  },
  calendarStyle: {
    "&  button": {
      fontSize: "1.1em",
    },
  },
  filterRow2: {
    display: "flex",
    // margin: theme.spacing(1, 0),
  },
}));

const calcAfterDate = () => {
  const now = new Date();
  const afterDate = new Date();
  afterDate.setMonth(now.getMonth() - 2);
  return afterDate;
};

export default function ActivitiesTab(props) {
  const classes = useStyles();

  // console.log("props");
  // console.log(props);

  const { blackgroundActive, setBlackground, setActivities, ...rest } = props;

  const [beforeDate, setBefore] = useState(new Date());

  const [afterDate, setAfter] = useState(calcAfterDate());
  const [activityType, setActivityType] = useState({
    Ride: true,
    VirtualRide: true,
    Run: false,
    Other: false,
  });

  const toggleActivityType = (type) => {
    const newActTypes = _.cloneDeep(activityType);
    newActTypes[type] = !newActTypes[type];
    setActivityType(newActTypes);
  };

  const onAfterChange = (newDate) => setAfter(newDate);
  const onBeforeChange = (newDate) => setBefore(newDate);



  function fetchActivities() {
    getActivities(activityType, afterDate, beforeDate)
      .then((result) => {
        setActivities(result);
      })
      .catch((err) => {
        console.error("Get Activites Error:", err);
        //TODO - snackbar msg
      });
  }

  return (
    <div className={classes.root}>
      <button onClick={() => apiTest()}>TEST</button>
      <div className={classes.datePicking}>
        <section className={classes.date}>
          <InputLabel>From:</InputLabel>
          <DatePicker
            className={classes.datePicker}
            onChange={onAfterChange}
            value={afterDate}
            calendarIcon={null}
            calendarClassName={classes.calendarStyle}
          />
        </section>
        <section className={classes.date}>
          <InputLabel>To:</InputLabel>
          <DatePicker
            className={classes.datePicker}
            onChange={onBeforeChange}
            value={beforeDate}
            calendarIcon={null}
            calendarClassName={classes.calendarStyle}
          />
        </section>
      </div>
      {/* datepicker */}
      <div className={classes.filterRow2}>
        <section>
          <InputLabel>Activity Type</InputLabel>
          <ActivityTypeSelect activityType={activityType} toggleActivityType={toggleActivityType} />
        </section>
        <section>
          <InputLabel>Hide Map</InputLabel>
          <Switch
            value={blackgroundActive}
            onChange={() => {
              setBlackground(!blackgroundActive);
            }}
          />
        </section>
      </div>
      <LineOptions fetchActivities={fetchActivities} {...rest} />
      <button onClick={() => fetchActivities()}>RABBLE</button>
    </div>
  );
}
