import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import DatePicker from "react-date-picker";
import { InputLabel } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "85vh",
  },
  datePicker: {
    width: 20,
  },
  date: {
    width: 150,
  },
  datePicking: {
    padding: 20,
    display: "flex",
  },
  fromCal: {
    left: -20,
    position: "absolute",
    "&  button": {
      fontSize: "1.1em",
    },
  },
  toCal: {
    left: -170,
    position: "absolute",
    "&  button": {
      fontSize: "1.1em",
    },
  },
}));

export default function ActivitiesTab() {
  const classes = useStyles();

  const [oldDate, setDate] = useState(new Date());

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
            calendarClassName={classes.fromCal}
          />
        </div>
        <div className={classes.date}>
          <InputLabel>To:</InputLabel>
          <DatePicker
            className={classes.datePicker}
            onChange={onChange}
            value={oldDate}
            calendarIcon={null}
            calendarClassName={classes.toCal}
          />
        </div>
      </div>
    </div>
  );
}
