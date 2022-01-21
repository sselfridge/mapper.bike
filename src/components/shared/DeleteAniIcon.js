import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { SvgIcon, makeStyles } from "@material-ui/core/";

const useStyles = makeStyles((theme) => ({
  root: {},
  "@keyframes closeTrash": {
    "0%": {
      transform: "rotate(10deg) translate(-2px, -10px)",
    },
    "50%": {
      transform: "rotate(10deg) translate(-2px, -2px)",
    },
    "70%": {
      transform: "rotate(-10deg) translate(2px, -2px)",
    },
    "90%": {
      transform: "rotate(10deg) translate(-2px, -2px)",
    },
    "100%": {
      transform: "rotate(0deg) translate(0, 0)",
    },
  },
  "@keyframes openTrash": {
    "0%": {
      transform: "translate(0, 0)",
    },
    "100%": {
      transform: "translate(0, -10px)",
    },
  },
  closeLid: {
    "& path:first-of-type": {
      transformOrigin: "center",
      animation: "$closeTrash 0.5s forwards 1",
    },
  },
  openLid: {
    "& path:first-of-type": {
      transformOrigin: "center",
      animation: "$openTrash 0.25s forwards 1",
    },
  },
}));

const DeleteAniIcon = (props) => {
  const [animationStyle, setAnimationStyle] = useState("close");

  const classes = useStyles();

  function handleMouseOver() {
    console.info("open!!");
    setAnimationStyle("open");
  }

  function handleMouseOut() {
    console.info("close!");
    setAnimationStyle("close");
  }

  return (
    <div
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      className={clsx({
        [classes.closeLid]: animationStyle === "close",
        [classes.openLid]: animationStyle === "open",
      })}
    >
      <SvgIcon focusable="false" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 "></path>
      </SvgIcon>
    </div>
  );
};

export default DeleteAniIcon;
