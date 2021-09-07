import React, { useState } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core";
import MenuRoundedIcon from "@material-ui/icons/MenuRounded";
import { deleteUser } from "../../api/strava";

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
  const [disabledDelete, setDisabledDelete] = useState(true);

  function handleOpen() {
    setModalOpen(true);
  }
  function handleClose() {
    setModalOpen(false);
    setDisabledDelete(true);
  }

  const handleDelete = () => {
    const id = currentUser.athleteId;
    deleteUser(id)
      .then(() => {
        console.log("User Deleted");
        stravaLogout();
        handleClose();
      })
      .catch((err) => {
        console.error("Error Deleting User");
        console.log(err);
        //TODO add snackbar
      });
  };

  const profileLink = `https://www.strava.com/athletes/${currentUser.athleteId}`;

  const avatar =
    currentUser.avatar === "avatar/athlete/large.png"
      ? "https://d3nn82uaxijpm6.cloudfront.net/assets/avatar/athlete/medium-bee27e393b8559be0995b6573bcfde897d6af934dac8f392a6229295290e16dd.png"
      : currentUser.avatar;

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
          <img className={classes.userAvatar} src={avatar} />
        </span>
      )}
      <MenuRoundedIcon className={classes.menuIcon} fontSize="large" onClick={handleOpen} />
      <MenuModal
        stravaLogout={stravaLogout}
        handleClose={handleClose}
        modalOpen={modalOpen}
        currentUser={currentUser}
        handleDelete={handleDelete}
        setDisabledDelete={setDisabledDelete}
        disabledDelete={disabledDelete}
      />
    </div>
  );
};

HeaderRight.propTypes = {
  stravaLogout: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default HeaderRight;
