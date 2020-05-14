import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { apiTest } from "../../../api/strava";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
  },
}));

const EffortsTab = () => {
  const [testText, setTestText] = useState("");
  const classes = useStyles();

  const clicky = () => {
    console.log("Allo!!");
    apiTest().then((result) => {
      console.log("result");
      console.log(result);
      setTestText(JSON.stringify(result));
    });
  };

  return (
    <div>
      <div className={classes.root}>
        <img src="http://clipartmag.com/images/website-under-construction-image-6.gif" />
      </div>
      <div>{testText}</div>
      <button onClick={clicky}>ASDF</button>
    </div>
  );
};

export default EffortsTab;
