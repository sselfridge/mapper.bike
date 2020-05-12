import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import moment from "moment";

import {
  makeStyles,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Tooltip,
} from "@material-ui/core/";
import DeleteIcon from "@material-ui/icons/Delete";

const useRowStyles = makeStyles((theme) => ({
  actions: {
    display: "flex",
    justifyContent: "space-evenly",
    "& > *": {
      // margin: 15,
    },
  },
  itemNumber: {
    minWidth: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
  listItem: {
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, .12)",
    },
  },
  secondaryText: {
    display: "flex",
    justifyContent: "space-between",
  },
  selectedStyle: {
    backgroundColor: "rgba(0, 0, 0, .13)",
  },
  stravaIcon: {
    height: theme.spacing(4),
    width: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.strava,
  },
  stravaBtn: {
    backgroundColor: theme.palette.strava,
    color: "white",
    maxHeight: 40,
  },
}));

function Row(props) {
  const classes = useRowStyles();

  let { activity, index, selectedAct, handleSelectedAct, setMapCenter } = props;

  const avatarStyles = {
    root: classes.itemNumber,
  };

  const distance = (activity.distance / 1609).toFixed(2);
  const date = moment.unix(activity.date);

  const totalHours = activity.elapsedTime / 3600;
  const hours = Math.floor(totalHours);
  const minutes = Math.floor((totalHours - hours) * 60);

  return (
    <div
      id={`row${activity.id}`}
      className={clsx({
        [classes.listItem]: true,
        [classes.selectedStyle]: activity.id === selectedAct.id,
      })}
    >
      <ListItem
        key={index}
        onClick={() => {
          handleSelectedAct(activity);
        }}
      >
        <ListItemAvatar classes={avatarStyles}>
          <div>{index + 1}</div>
        </ListItemAvatar>
        <ListItemText
          primary={activity.name}
          // secondary={`${distance}mi ${date.format("MMM DD")} ${hours}:${minutes} hrs`}
          secondary={
            <span className={classes.secondaryText}>
              <span>{`${distance}mi`}</span>
              <span>{`${date.format("MMM DD")}`}</span>
              <span>{`${hours}:${minutes} hrs`}</span>
            </span>
          }
        />
      </ListItem>
      {selectedAct === activity.id && (
        <div className={classes.actions}>
          <Tooltip title="Remove from map" placement={"top"}>
            <IconButton aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="View on Strava" placement={"top"}>
            <IconButton>
              <a href="http://www.strava.com" rel="noopener noreferrer" target="_blank">
                <img className={classes.stravaIcon} src={"client/img/strava-icon.svg"} />
              </a>
            </IconButton>
          </Tooltip>
          {/* <Button variant={"contained"} className={classes.stravaBtn}>
            View On Strava
          </Button> */}
        </div>
      )}
    </div>
  );
}

Row.propTypes = {
  index: PropTypes.number.isRequired,
  activity: PropTypes.object.isRequired,
};

export default Row;
