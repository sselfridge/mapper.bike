import React, { useState } from "react";
import { makeStyles, Button, Checkbox, Tooltip, Modal } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modalPaper: {
    fontFamily: theme.typography.fontFamily,
    position: "absolute",
    width: 200,
    backgroundColor: "white",
    top: 5,
    right: 5,
    border: "2px solid #000",
    boxShadow: "10px 5px 5px black",
    "& > a": {
      textAlign: "right",
      textDecoration: "none",
      color: "black",
    },
  },
  deleteBtn: {
    color: theme.palette.error.contrastText,
    backgroundColor: theme.palette.error.main,
  },
}));

const MenuModal = (props) => {
  const classes = useStyles();
  const { stravaLogout, modalOpen, handleClose } = props;
  const [disabledDelete, setDisabledDelete] = useState(true);

  return (
    <div>
      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={{ top: 0, right: 0 }} className={classes.modalPaper}>
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
          <hr />
          <Checkbox
            checked={!disabledDelete}
            onChange={() => {
              setDisabledDelete(!disabledDelete);
            }}
          />

          <Tooltip title="Click Box to enable Delete. CANNOT BE UN-DONE!">
            <Button disabled={disabledDelete} className={classes.deleteBtn}>Delete All My Data</Button>
          </Tooltip>
        </div>
      </Modal>
    </div>
  );

  // return (
  //
  // );
};

export default MenuModal;
