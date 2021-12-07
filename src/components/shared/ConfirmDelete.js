import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import { makeStyles, IconButton, Tooltip } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  ConfirmDelete: {},
  redIcon: {
    color: "red",
  },
  tooltip: {
    fontSize: 16,
  },
}));

const ConfirmDelete = (props) => {
  const { onDelete } = props;
  const classes = useStyles();

  const [waiting, setWaiting] = useState(false);
  const [enableDelete, setEnableDelete] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    if (waiting) {
      setTimeout(() => {
        setEnableDelete(true);
        setWaiting(false);
      }, 750);
    }
  }, [waiting]);

  useEffect(() => {
    if (enableDelete) {
      ref.current = setTimeout(() => {
        setEnableDelete(false);
      }, 2000);
    }
    return () => {
      clearTimeout(ref.current);
    };
  }, [enableDelete]);

  return (
    <div className={classes.ConfirmDelete}>
      {enableDelete ? (
        <Tooltip
          title={<span className={classes.tooltip}>Confirm Delete</span>}
          arrow
        >
          <IconButton onClick={onDelete}>
            <DeleteIcon className={classes.redIcon} />
          </IconButton>
        </Tooltip>
      ) : (
        <IconButton
          onClick={() => {
            setWaiting(true);
          }}
          disabled={waiting}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </div>
  );
};

ConfirmDelete.propTypes = {
  onDelete: PropTypes.func.isRequired,
};

export default ConfirmDelete;
