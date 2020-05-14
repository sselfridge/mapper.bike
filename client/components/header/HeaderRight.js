import React, { useState } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core";
import MenuRoundedIcon from "@material-ui/icons/MenuRounded";
import MenuModal from "./MenuModal";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  userInfo: {
    display: "flex",
    padding: "10px 0px",
  },
  username: {
    padding: theme.spacing(1),
    lineHeight: 2,
    textDecoration: "none",
    color: "black",
  },
  userAvatar: {
    height: "30px",
    width: "30px",
    borderRadius: "20px",
  },
  menuIcon: {
    padding: theme.spacing(1),
  },
}));

const HeaderRight = (props) => {
  const { stravaLogout, currentUser } = props;
  const classes = useStyles();

  const [modalOpen, setModalOpen] = useState(false);

  function handleOpen() {
    setModalOpen(true);
  }
  function handleClose() {
    setModalOpen(false);
  }

  const profileLink = `https://www.strava.com/athletes/${currentUser.athleteId}`;

  return (
    <div className={classes.root}>
      {currentUser.firstname && (
        <span className={classes.userInfo}>
          <div>
            <a
              className={classes.username}
              href={profileLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              {currentUser.firstname} {currentUser.lastname}
            </a>
          </div>
          <img className={classes.userAvatar} src={currentUser.avatar} />
        </span>
      )}
      <MenuRoundedIcon className={classes.menuIcon} fontSize="large" onClick={handleOpen} />
      <MenuModal stravaLogout={stravaLogout} handleClose={handleClose} modalOpen={modalOpen} currentUser={currentUser} />
    </div>
  );
};

HeaderRight.propTypes = {
  stravaLogout: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default HeaderRight;
