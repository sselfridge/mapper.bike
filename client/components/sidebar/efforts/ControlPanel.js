import React, { useState } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";
import { Switch, Button } from "@material-ui/core";
import CenterFocusWeakOutlinedIcon from "@material-ui/icons/CenterFocusWeakOutlined";

import InputLabel from "../../styledMui/InputLabel";
import CenterMapModal from "../shared/CenterMapModal";
import RankFilter from "./RankFilter";
import RankColor from "./RankColor";

const useStyles = makeStyles((theme) => ({
  root: {},

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
  rankSwitch: {
    display: "flex",
  },
}));

const ControlPanel = (props) => {
  const classes = useStyles();

  const { blackgroundActive, setBlackground, fetchEfforts, setMapCenter, snackBar } = props;

  const [showCenterModal, setShowCenterModal] = useState(false);
  const [rankFilterOrColor, setRankFilterOrColor] = useState(false);
  const [formats, setFormats] = React.useState(() => [1]);
  const [colors, setColors] = useState({});

  const handleFormat = (event, newFormats) => {
    setFormats(newFormats);
  };

  return (
    <div className={classes.root}>
      <div>
        <section>
          <Button
            onClick={() => fetchEfforts()}
            className={classes.getBtn}
            variant="contained"
            color="primary"
          >
            Reset Efforts
          </Button>
        </section>
        <section>
          <div className={classes.toggleContainer}>
            <div className={classes.rankSwitch}>
              <InputLabel>Filter by Rank</InputLabel>
              <Switch
                checked={!rankFilterOrColor}
                onChange={() => {
                  setRankFilterOrColor(!rankFilterOrColor);
                }}
              />
              <InputLabel>Set Color</InputLabel>
            </div>
            {rankFilterOrColor && <RankFilter formats={formats} handleFormat={handleFormat} />}
            {!rankFilterOrColor && <RankColor />}
          </div>
        </section>
      </div>
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
