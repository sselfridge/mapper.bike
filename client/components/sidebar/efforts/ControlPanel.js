import React, { useState } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";
import { Switch, Button } from "@material-ui/core";
import CenterFocusWeakOutlinedIcon from "@material-ui/icons/CenterFocusWeakOutlined";

import InputLabel from "../../styledMui/InputLabel";
import CenterMapModal from "../shared/CenterMapModal";

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

  icon: {
    height: theme.spacing(4),
    width: theme.spacing(4),
    cursor: "pointer",
    margin: "auto",
  },
  mapControls: {
    display: "flex",
    // margin: theme.spacing(1, 0),
  },
}));

const ControlPanel = (props) => {
  const classes = useStyles();

  const {
    blackgroundActive,
    setBlackground,
    fetchEfforts,

    setMapCenter,

    snackBar,
    ...rest
  } = props;

  const [showCenterModal, setShowCenterModal] = useState(false);

  return (
    <div className={classes.root}>
      <div className={classes.datePicking}>
        <section>
          <Button
            onClick={() => fetchEfforts()}
            className={classes.getBtn}
            variant="contained"
            color="primary"
          >
            Get Efforts
          </Button>
        </section>
      </div>
      {/* datepicker */}
      <div className={classes.mapControls}>
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
  fetchEfforts: PropTypes.func.isRequired,

  setMapCenter: PropTypes.func.isRequired,

  snackBar: PropTypes.func.isRequired,
};

export default ControlPanel;
