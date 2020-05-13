import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, Button, ClickAwayListener, Slider } from "@material-ui/core";
import { TwitterPicker } from "react-color";
import { lineColors } from "../../../constants/map";
import InputLabel from "../../styledMui/InputLabel";

const useStyles = makeStyles((theme) => ({
  root: { display: "flex", justifyContent: "space-around" },
  colorBox: {
    height: theme.spacing(4),
    width: theme.spacing(4),
    border: "2px black solid",
  },
  colorPicker: {
    display: "flex",
    flexDirection: "column",
    alignItems: 'center'
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
    width: 80,
  },
}));

const LineOptions = (props) => {
  const classes = useStyles();

  const {
    lineWeight,
    setLineWeight,
    lineColor,
    setLineColor,
    fetchActivities,
    setSelectedColor,
    selectedColor,
  } = props;

  const [showPicker, setShowPicker] = useState(false);
  const [showSelectPicker, setSelectPicker] = useState(false);

  const handleColorChange = (color, target) => {
    if (target === "selected") {
      setSelectedColor(color.hex);
      setSelectPicker(false);
    } else {
      setLineColor(color.hex);
      setShowPicker(false);
    }
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
      <section className={classes.colorPicker}>
        <InputLabel>Color</InputLabel>
        <div
          className={classes.colorBox}
          style={{ backgroundColor: lineColor }}
          onClick={() => setShowPicker(true)}
        />
      </section>
      <section className={classes.colorPicker}>
        <InputLabel>Selected</InputLabel>
        <div
          className={classes.colorBox}
          style={{ backgroundColor: selectedColor }}
          onClick={() => setSelectPicker(true)}
        />
      </section>
      {/* <section className={classes.slider}>
        <InputLabel>Line Thickness</InputLabel>
        <Slider
          style={sliderStyles}
          valueLabelDisplay="auto"
          value={lineWeight}
          min={1}
          max={20}
          onChange={(e, val) => setLineWeight(val)}
        />
      </section> */}
      {showPicker && (
        <ClickAwayListener onClickAway={() => setShowPicker(false)}>
          <div className={classes.picker}>
            <TwitterPicker
              color={lineColor}
              colors={lineColors}
              onChangeComplete={(color) => {
                handleColorChange(color, "line");
              }}
            />
          </div>
        </ClickAwayListener>
      )}
      {showSelectPicker && (
        <ClickAwayListener onClickAway={() => setSelectPicker(false)}>
          <div className={classes.picker}>
            <TwitterPicker
              color={selectedColor}
              colors={lineColors}
              onChangeComplete={(color) => {
                handleColorChange(color, "selected");
              }}
            />
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};

export default LineOptions;
