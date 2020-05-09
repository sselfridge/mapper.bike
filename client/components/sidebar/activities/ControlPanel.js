import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import DatePicker from "react-date-picker";
import _ from "lodash";
import { Switch } from "@material-ui/core";
import CenterFocusWeakOutlinedIcon from "@material-ui/icons/CenterFocusWeakOutlined";

import InputLabel from "../../styledMui/InputLabel";
import CenterMapModal from "../shared/CenterMapModal";
import ActivityTypeSelect from "./ActivityTypeSelect";
import LineOptions from "./LineOptions";

const useStyles = makeStyles((theme) => ({
  root: {},
  calendarStyle: {
    "&  button": {
      fontSize: "1.1em",
    },
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
  icon: {
    height: theme.spacing(4),
    width: theme.spacing(4),
    cursor: 'pointer',
  },
  filterRow2: {
    display: "flex",
    // margin: theme.spacing(1, 0),
  },
}));

const ControlPanel = (props) => {
  const classes = useStyles();

  const {
    blackgroundActive,
    setBlackground,
    fetchActivities,
    activityType,
    setActivityType,
    setMapCenter,
    onAfterChange,
    afterDate,
    onBeforeChange,
    beforeDate,
    ...rest
  } = props;


  const [showCenterModal, setShowCenterModal] = useState(false);

  const toggleActivityType = (type) => {
    const newActTypes = _.cloneDeep(activityType);
    newActTypes[type] = !newActTypes[type];
    setActivityType(newActTypes);
  };


  return (
    <div className={classes.root}>
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
        <section>
          <InputLabel>Center Map</InputLabel>
          <CenterFocusWeakOutlinedIcon
            onClick={() => setShowCenterModal(true)}
            className={classes.icon}
          />
        </section>
      </div>
      <LineOptions fetchActivities={fetchActivities} {...rest} />

      <CenterMapModal
        showCenterModal={showCenterModal}
        setShowCenterModal={setShowCenterModal}
        setMapCenter={setMapCenter}
      />
    </div>
  );
};

export default ControlPanel;
