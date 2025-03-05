import React, { useState } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import DatePicker from "react-date-picker";
import _ from "lodash";
import { Switch, Button } from "@material-ui/core";
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
  centerMap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  datePicker: {
    width: 20,
  },
  date: {
    width: 150,
    display: "flex",
    flexDirection: "column",
  },
  datePicking: {
    display: "flex",
    // margin: theme.spacing(1, 0),
  },
  icon: {
    height: theme.spacing(4),
    width: theme.spacing(4),
    cursor: "pointer",
    margin: "auto",
  },
  lineControls: {
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
    snackBar,
    currentUser: { athleteId },
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
          <DatePicker
            className={classes.datePicker}
            onChange={onAfterChange}
            value={new Date(afterDate * 1000)}
            calendarIcon={null}
            calendarClassName={classes.calendarStyle}
          />
          <DatePicker
            className={classes.datePicker}
            onChange={onBeforeChange}
            value={new Date(beforeDate * 1000)}
            calendarIcon={null}
            calendarClassName={classes.calendarStyle}
          />
        </section>
        <section>
          <ActivityTypeSelect
            activityType={activityType}
            toggleActivityType={toggleActivityType}
          />
        </section>
        <section>
          <Button
            onClick={() => fetchActivities()}
            className={classes.getBtn}
            variant="contained"
            color="primary"
            disabled={athleteId === 101}
          >
            Get Rides
          </Button>
        </section>
      </div>
      {/* datepicker */}
      <div className={classes.lineControls}>
        <section>
          <InputLabel>Hide Map</InputLabel>
          <Switch
            value={blackgroundActive}
            onChange={() => {
              setBlackground(!blackgroundActive);
            }}
          />
        </section>
        <section className={classes.centerMap}>
          <InputLabel>Center Map</InputLabel>
          <CenterFocusWeakOutlinedIcon
            onClick={() => setShowCenterModal(true)}
            className={classes.icon}
          />
        </section>
        <LineOptions fetchActivities={fetchActivities} {...rest} />
      </div>

      <CenterMapModal
        showCenterModal={showCenterModal}
        setShowCenterModal={setShowCenterModal}
        setMapCenter={setMapCenter}
        snackBar={snackBar}
      />
    </div>
  );
};

ControlPanel.propTypes = {
  blackgroundActive: PropTypes.bool.isRequired,
  setBlackground: PropTypes.func.isRequired,
  fetchActivities: PropTypes.func.isRequired,
  activityType: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  setActivityType: PropTypes.func.isRequired,
  setMapCenter: PropTypes.func.isRequired,
  onAfterChange: PropTypes.func.isRequired,
  afterDate: PropTypes.number.isRequired,
  onBeforeChange: PropTypes.func.isRequired,
  snackBar: PropTypes.func.isRequired,
  beforeDate: PropTypes.number.isRequired,
};

export default ControlPanel;
