import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, Button, ClickAwayListener, Slider } from "@material-ui/core";
import { CirclePicker } from "react-color";

import InputLabel from "../../styledMui/InputLabel";

const useStyles = makeStyles((theme) => ({
  root: { display: "flex", justifyContent: "space-around" },
  colorBox: {
    height: theme.spacing(4),
    width: theme.spacing(4),
    marginLeft: "25%",
    border: "2px black solid",
  },
  getBtn: {
    marginTop: theme.spacing(2),
  },
  picker: {
    position: "absolute",
    left: theme.spacing(5),
    padding: theme.spacing(2),
    backgroundColor: "white",
    borderRadius: theme.shape.borderRadius,
  },
  slider: {
    width: 120,
  },
}));

const LineOptions = (props) => {
  const classes = useStyles();

  const { lineWeight, setLineWeight, lineColor, setLineColor, fetchActivities } = props;

  const [showPicker, setShowPicker] = useState(false);

  const handleColorChange = (color) => {
    setLineColor(color.hex);
    setShowPicker(false);
  };

  const sliderStyles = {
    track: {
      height: 8,
      borderRadius: 4,
    },
    rail: {
      height: 8,
      borderRadius: 4,
    },
  };

  return (
    <div className={classes.root}>
      <section>
        <InputLabel>Line Color</InputLabel>
        <div
          className={classes.colorBox}
          style={{ backgroundColor: lineColor }}
          onClick={() => setShowPicker(true)}
        />
      </section>
      <section className={classes.slider}>
        <InputLabel>Line Thickness</InputLabel>
        <Slider
          style={sliderStyles}
          valueLabelDisplay="auto"
          value={lineWeight}
          min={1}
          max={30}
          onChange={(e, val) => setLineWeight(val)}
        />
      </section>
      <section>
        <InputLabel></InputLabel>
        <Button
          onClick={() => fetchActivities()}
          className={classes.getBtn}
          variant="contained"
          color="primary"
        >
          Get Rides
        </Button>
      </section>
      {showPicker && (
        <ClickAwayListener onClickAway={() => setShowPicker(false)}>
          <div className={classes.picker}>
            <CirclePicker color={lineColor} onChangeComplete={handleColorChange} />
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};

export default LineOptions;
