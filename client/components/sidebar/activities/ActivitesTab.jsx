import React, { useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import DatePicker from "react-date-picker";
import _ from "lodash";
import { Switch } from "@material-ui/core";
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

export default function ActivitiesTab(props) {
  const classes = useStyles();

  const [oldDate, setDate] = useState(new Date());
  const [activityType, setActivityType] = useState({
    Ride: true,
    VirtualRide: true,
    Run: false,
    Other: false,
  });

  const toggleActivityType = (type) => {
    console.log("Toggle:", type);
    const newActTypes = _.cloneDeep(activityType);
    newActTypes[type] = !newActTypes[type];
    setActivityType(newActTypes);
  };

  const onChange = (newDate) => setDate(newDate);

  return (
    <div className={classes.root}>
      <div className={classes.datePicking}>
        <section className={classes.date}>
          <InputLabel>From:</InputLabel>
          <DatePicker
            className={classes.datePicker}
            onChange={onChange}
            value={oldDate}
            calendarIcon={null}
            calendarClassName={classes.calendarStyle}
          />
        </section>
        <section className={classes.date}>
          <InputLabel>To:</InputLabel>
          <DatePicker
            className={classes.datePicker}
            onChange={onChange}
            value={oldDate}
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
          <Switch></Switch>
        </section>
      </div>
      <LineOptions />
    </div>
  );
}
