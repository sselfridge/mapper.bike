import React from "react";

import Typography from "@material-ui/core/Typography";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

const RankFilter = (props) => {
  const { formats, handleFormat } = props;

  return (
    <ToggleButtonGroup value={formats} onChange={handleFormat} aria-label="text formatting">
      <ToggleButton value={1} aria-label="1">
        <Typography>1</Typography>
      </ToggleButton>
      <ToggleButton value={2} aria-label="2">
        <Typography>2</Typography>
      </ToggleButton>
      <ToggleButton value={3} aria-label="3">
        <Typography>3</Typography>
      </ToggleButton>
      <ToggleButton value={4} aria-label="4">
        <Typography>4</Typography>
      </ToggleButton>
      <ToggleButton value={5} aria-label="5">
        <Typography>5</Typography>
      </ToggleButton>
      <ToggleButton value={6} aria-label="6">
        <Typography>6</Typography>
      </ToggleButton>
      <ToggleButton value={7} aria-label="7">
        <Typography>7</Typography>
      </ToggleButton>
      <ToggleButton value={8} aria-label="8">
        <Typography>8</Typography>
      </ToggleButton>
      <ToggleButton value={9} aria-label="9">
        <Typography>9</Typography>
      </ToggleButton>
      <ToggleButton value={10} aria-label="10">
        <Typography>10</Typography>
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default RankFilter;
