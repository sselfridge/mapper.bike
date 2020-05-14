import React from "react";
import { makeStyles } from "@material-ui/core/styles";

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
  },
}));

const gifs = [
  "http://clipartmag.com/images/website-under-construction-image-6.gif",
  "https://clipartion.com/wp-content/uploads/2015/11/under-construction-clip-art-clipart-free-clipart.gif",
  "http://images.clipartpanda.com/construction-site-clipart-under-construction-sign-animated.gif",
  "http://orvex.org.p11.hostingprod.com/images/under_construction.gif",
  "http://www.bestgraph.com/gifs/info/construc/construc-12.gif",
  "http://animations.fg-a.com/under-construction/under-construction-flashing-lights.gif",
  "https://media.giphy.com/media/EdBq6OQN7JUly/giphy.gif",
];

const EffortsTab = () => {
  const classes = useStyles();

  const size = gifs.length;
  const rand = Math.floor(Math.random() * size);

  return (
    <div>
      <div className={classes.root}>
        <img src={gifs[rand]} />
      </div>
    </div>
  );
};

export default EffortsTab;
