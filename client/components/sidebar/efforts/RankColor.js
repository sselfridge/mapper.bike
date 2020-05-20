import React, { useState } from "react";

import Typography from "@material-ui/core/Typography";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import { makeStyles, ClickAwayListener } from "@material-ui/core";
import { TwitterPicker } from "react-color";

import { effortColors } from "../../../constants/map";

const useStyles = makeStyles((theme) => ({ root: {} }));

const SingleRankColor = (props) => {
  const { number, setShowPicker, setColorIndex, colorArray } = props;

  const num = parseInt(number);

  return (
    <ToggleButton
      value={num}
      aria-label={`${num}`}
      onClick={() => {
        setShowPicker(true);
        setColorIndex(num);
      }}
      style={{ backgroundColor: colorArray[num] }}
    >
      <Typography>{num}</Typography>
    </ToggleButton>
  );
};

const RankColor = (props) => {
  const classes = useStyles();
  const { formats, handleFormat } = props;

  const [showPicker, setShowPicker] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const [colorArray, setColorArray] = useState([
    null,
    "#ff6900",
    "#fcb900",
    "#7bdcb5",
    "#52eb0e",
    "#8ed1fc",
    "#0693e3",
    "#0000ff",
    "#eb144c",
    "#f78da7",
    "#9900ef",
  ]);
  const rankArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  console.log(colorArray);

  return (
    <div className={classes.root}>
      <ToggleButtonGroup aria-label="text formatting">
        {rankArray.map((number) => (
          <SingleRankColor
            key={number}
            number={number}
            setShowPicker={setShowPicker}
            setColorIndex={setColorIndex}
            colorArray={colorArray}
          />
        ))}
      </ToggleButtonGroup>
      {showPicker && (
        <ClickAwayListener onClickAway={() => setShowPicker(false)}>
          <div className={classes.picker}>
            <TwitterPicker
              color={colorArray[colorIndex]}
              colors={effortColors}
              onChangeComplete={(color) => {
                console.log("Picked:", color);
                colorArray[colorIndex] = color.hex;
                setColorArray(colorArray.slice());
                setShowPicker(false);
              }}
            />
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};

export default RankColor;
