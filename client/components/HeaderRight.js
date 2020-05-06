import React, { useState } from "react";
import { makeStyles, Modal } from "@material-ui/core";
// import MenuIcon from "@material-ui/core/MenuIcon";
import MenuRoundedIcon from "@material-ui/icons/MenuRounded";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  userInfo: {
    display: "flex",
    padding: "10px 0px",
  },
  username: {
    padding: 10,
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
    padding: "7px 7px 7px 7px",
  },
  modalPaper: {
    position: "absolute",
    width: 200,
    backgroundColor: "white",
    top: 5,
    right: 5,
    border: "2px solid #000",
    // borderRadius: 25,
    boxShadow: "10px 5px 5px black",
    padding: theme.spacing(2, 4, 3),
    "& > a": {
      textAlign: "right",
      textDecoration: "none",
      color: "black",
    },
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

  console.log("Header Props");
  console.log(props);

  const modalMenu = (
    <div style={{ top: 0, right: 0 }} className={classes.modalPaper} id="menuModal">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="http://www.github.com/sselfridge/mapper.bike"
      >
        View source on GitHub
      </a>
      <hr />
      <a href="mailto:Sam.Selfridge@gmail.com">Sam.Selfridge@gmail.com</a>
      <hr />
      <a href="" onClick={stravaLogout}>
        Logout
      </a>
    </div>
  );

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
      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {modalMenu}
      </Modal>
      {/* {showMenu && modalMenu} */}
    </div>
  );
};

export default HeaderRight;
