import React, { useState } from "react";

import Typography from "@material-ui/core/Typography";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import { makeStyles, ClickAwayListener } from "@material-ui/core";
import { TwitterPicker } from "react-color";

import { lineColors } from "../../../constants/map";

const useStyles = makeStyles((theme) => ({ root: {} }));

const SingleRankColor = (props) => {
  const { strNum, setShowPicker } = props;

  const number = parseInt(strNum);

  return (
    <ToggleButton
      value={number}
      aria-label={`${number}`}
      onClick={() => {
        setShowPicker(true);
      }}
    >
      <Typography>{number}</Typography>
    </ToggleButton>
  );
};

const RankColor = (props) => {
  const classes = useStyles();
  const { formats, handleFormat } = props;

  const [showPicker, setShowPicker] = useState(false);

  const rankArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className={classes.root}>
      <ToggleButtonGroup aria-label="text formatting">
        {rankArray.map((number) => (
          <SingleRankColor key={number} strNum={number} setShowPicker={setShowPicker} />
        ))}
      </ToggleButtonGroup>
      {showPicker && (
        <ClickAwayListener onClickAway={() => setShowPicker(false)}>
          <div className={classes.picker}>
            <TwitterPicker color={""} colors={lineColors} onChangeComplete={() => {}} />
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};

export default RankColor;
