import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { makeStyles, Button, TextField, Modal } from "@material-ui/core";

import { centerOnLocation } from "../../../api/google";

const useStyles = makeStyles((theme) => ({
  modalPaper: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    fontFamily: theme.typography.fontFamily,
    position: "absolute",
    width: 200,
    top: "200px",
    left: "150px",
    backgroundColor: "white",
    border: "2px solid #000",
    boxShadow: "10px 5px 5px black",
    "& > a": {
      textAlign: "right",
      textDecoration: "none",
      color: "black",
    },
  },
}));

const CenterMapModal = (props) => {
  const classes = useStyles();
  const { showCenterModal, setShowCenterModal, setMapCenter, snackBar } = props;

  function handleChange(e) {
    if (e.key === "Enter") {
      handleGetCenter(e.target.value);
    }
  }
  const handleCenterBtn = () => {
    const value = document.getElementById("centerModalText").value;
    handleGetCenter(value);
  };

  const handleGetCenter = (value) => {
    centerOnLocation(value)
      .then(({ center }) => {
        if (center !== null) {
          setShowCenterModal(false);
          setMapCenter(center);
        } else {
          snackBar("Location Not Found", "warning");
        }
      })
      .catch((err) => {
        console.error(err);
        //TODO snackbar msg
      });
  };

  useEffect(() => {
    setTimeout(() => {
      const textfield = document.getElementById("centerModalText");
      if (textfield) textfield.focus();
    }, 600);
  });

  return (
    <div className={classes.root}>
      <Modal
        open={showCenterModal}
        onClose={() => {
          setShowCenterModal(false);
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={classes.modalPaper}>
          <TextField
            id="centerModalText"
            onKeyDown={handleChange}
            label="Center Map On:"
            variant="outlined"
          />
          <Button variant="contained" color="primary" onClick={handleCenterBtn}>
            Center
          </Button>
        </div>
      </Modal>
    </div>
  );
};

CenterMapModal.propTypes = {
  showCenterModal: PropTypes.bool.isRequired,
  setShowCenterModal: PropTypes.func.isRequired,
  setMapCenter: PropTypes.func.isRequired,
  snackBar: PropTypes.func.isRequired,
};

export default CenterMapModal;
