import React, { useState } from "react";
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import { makeStyles, ClickAwayListener } from "@material-ui/core";
import { TwitterPicker } from "react-color";

import { effortColors } from "../../../constants/map";

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles((theme) => ({ root: {} }));

const SingleRankColor = (props) => {
  const { number, setShowPicker, setColorIndex, rankColors } = props;

  const num = parseInt(number);

  return (
    <ToggleButton
      value={num + 1}
      aria-label={`${num + 1}`}
      onClick={() => {
        setShowPicker(true);
        setColorIndex(num);
      }}
      style={{ backgroundColor: rankColors[num] }}
    >
      <Typography>{num + 1}</Typography>
    </ToggleButton>
  );
};

const RankColor = (props) => {
  const classes = useStyles();
  const { rankColors, setRankColors } = props;

  const [showPicker, setShowPicker] = useState(false);
  const [colorIndex, setColorIdx] = useState(0);
  const setColorIndex = (index) => setColorIdx(index);

  const rankArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className={classes.root}>
      <ToggleButtonGroup aria-label="text formatting">
        {rankArray.map((number) => (
          <SingleRankColor
            key={number}
            number={number}
            setShowPicker={setShowPicker}
            setColorIndex={setColorIndex}
            rankColors={rankColors}
          />
        ))}
      </ToggleButtonGroup>
      {showPicker && (
        <ClickAwayListener onClickAway={() => setShowPicker(false)}>
          <div className={classes.picker}>
            <TwitterPicker
              color={effortColors[colorIndex]}
              colors={effortColors.slice()}
              onChangeComplete={(color) => {
                rankColors[colorIndex] = color.hex;
                setRankColors(rankColors.slice());
                setShowPicker(false);
              }}
            />
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};

SingleRankColor.propTypes = {
  number: PropTypes.number.isRequired,
  setShowPicker: PropTypes.func.isRequired,
  setColorIndex: PropTypes.func.isRequired,
  rankColors: PropTypes.array.isRequired,
};
RankColor.propTypes = {
  rankColors: PropTypes.array.isRequired,
  setRankColors: PropTypes.func.isRequired,
};
export default RankColor;
