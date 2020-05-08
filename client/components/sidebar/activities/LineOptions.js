import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, Button, ClickAwayListener, Slider } from "@material-ui/core";
import { ChromePicker } from "react-color";

import InputLabel from "../../styledMui/InputLabel";

const useStyles = makeStyles((theme) => ({
  root: { display: "flex", justifyContent: "space-around" },
  colorBox: {
    height: theme.spacing(4),
    width: theme.spacing(4),
    marginLeft: "25%",
    border: "2px black solid",
  },
  getBtn:{
      marginTop: theme.spacing(2)
  },
  picker: {
    position: "absolute",
    left: 45,
    padding: 15,
  },
  slider: {
    width: 120,
  },
}));

const LineOptions = (props) => {
  const classes = useStyles();
  const [lineColor, setLineColor] = useState("blue");
  const [showPicker, setShowPicker] = useState(false);
  const [lineThickness, setLineThickness] = useState(5);

  const handleColorChange = (color) => {
    console.log("New Color:");
    console.log(color);
    setLineColor(color.hex);
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
          value={lineThickness}
          min={1}
          max={30}
          onChange={(e, val) => setLineThickness(val)}
        />
      </section>
      <section>
          <InputLabel></InputLabel>
          <Button className={classes.getBtn} variant="contained"  color='primary'>Get Rides</Button>
      </section>
      {showPicker && (
        <ClickAwayListener onClickAway={() => setShowPicker(false)}>
          <div className={classes.picker}>
            <ChromePicker color={lineColor} onChangeComplete={handleColorChange} />
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};

export default LineOptions;
