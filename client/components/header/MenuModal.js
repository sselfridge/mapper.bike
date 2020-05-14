import React, { useState } from "react";
import PropTypes from "prop-types";

import { makeStyles, Button, Checkbox, Tooltip, Modal } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modalPaper: {
    padding: theme.spacing(3),
    fontFamily: theme.typography.fontFamily,
    position: "absolute",
    width: 300,
    backgroundColor: "white",
    top: 15,
    right: 15,
    border: "2px solid #000",
    boxShadow: "10px 5px 5px black",
  },
  deleteBox: {
    display: "flex",
    justifyContent: "space-around",
  },
  deleteBtn: {
    color: theme.palette.error.contrastText,
    backgroundColor: theme.palette.error.main,
  },
}));

const MenuModal = (props) => {
  const classes = useStyles();
  const { stravaLogout, currentUser, modalOpen, handleClose } = props;
  const [disabledDelete, setDisabledDelete] = useState(true);

  return (
    <div className={classes.root}>
      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={{ top: 0, right: 0 }} className={classes.modalPaper}>
          <section>
            <Button
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.github.com/sselfridge/mapper.bike"
              onClick={handleClose}
            >
              View source on GitHub
            </Button>
          </section>
          <hr />
          <section>
            <Button onClick={handleClose} href="mailto:Sam.Selfridge@gmail.com">
              Feedback?
            </Button>
          </section>
          <hr />
          <section>
            <Button
              href=""
              onClick={() => {
                stravaLogout();
                handleClose();
              }}
            >
              Logout
            </Button>
          </section>
          {currentUser.optIn && (
            <Tooltip title="Click Box to enable Delete. CANNOT BE UN-DONE!">
              <hr />
              <div className={classes.deleteBox}>
                <Checkbox
                  checked={!disabledDelete}
                  onChange={() => {
                    setDisabledDelete(!disabledDelete);
                  }}
                />
                <Button
                  variant={"contained"}
                  disabled={disabledDelete}
                  className={classes.deleteBtn}
                >
                  Delete All My Data
                </Button>
              </div>
            </Tooltip>
          )}
        </div>
      </Modal>
    </div>
  );

  // return (
  //
  // );
};
MenuModal.propTypes = {
  stravaLogout: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  modalOpen: PropTypes.bool.isRequired,
  currentUser: PropTypes.object.isRequired,
};
export default MenuModal;
