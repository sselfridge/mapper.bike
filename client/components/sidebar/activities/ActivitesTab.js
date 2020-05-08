import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import DatePicker from "react-date-picker";
import { InputLabel } from "@material-ui/core";

import ActivityTypeSelect from "./ActivityTypeSelect";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "87.5vh",
    backgroundColor: "#aadaff",
    padding: 10
  },
  datePicker: {
    width: 20,
  },
  date: {
    width: 150,
  },
  datePicking: {
    display: "flex",
  },
  calendarStyle: {
    "&  button": {
      fontSize: "1.1em",
    },
  },
}));

export default function ActivitiesTab(props) {
  const classes = useStyles();

  const [oldDate, setDate] = useState(new Date());

  const onTypeChange = (e) => {};

  const onChange = (newDate) => setDate(newDate);

  return (
    <div className={classes.root}>

      <div className={classes.datePicking}>
        <div className={classes.date}>
          <InputLabel>From:</InputLabel>
          <DatePicker
            className={classes.datePicker}
            onChange={onChange}
            value={oldDate}
            calendarIcon={null}
            calendarClassName={classes.calendarStyle}
          />
        </div>
        <div className={classes.date}>
          <InputLabel>To:</InputLabel>
          <DatePicker
            className={classes.datePicker}
            onChange={onChange}
            value={oldDate}
            calendarIcon={null}
            calendarClassName={classes.calendarStyle}
          />
        </div>
      </div> 
      {/* datepicker */}
      <InputLabel>Activity Type</InputLabel>
      <ActivityTypeSelect />
    </div>
  );
}
