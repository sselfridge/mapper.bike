import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import moment from "moment";

import { noKeyOverLap } from "../../../utils";

import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Tooltip,
} from "@material-ui/core/";

import DeleteIcon from "@material-ui/icons/Delete";
import Map from "@material-ui/icons/Map";

import { useRowStyles } from "../shared/styles";

function Row(props) {
  const classes = useRowStyles();

  let {
    activity,
    index,
    selectedAct,
    handleSelected,
    handleRemoveLine,
    centerMapOnActivity,
  } = props;

  const avatarStyles = {
    root: classes.itemNumber,
  };

  noKeyOverLap(classes, { ab: 1234 });
  const distance = (activity.distance / 1609).toFixed(2);
  const date = moment.unix(activity.date);

  const totalHours = activity.elapsedTime / 3600;
  const hours = Math.floor(totalHours);
  const minutes = Math.floor((totalHours - hours) * 60);

  const infoA = `${distance}mi`;
  const infoB = `${date.format("MMM DD")}`;
  const infoC = `${hours}:${minutes} hrs`;
  const stravaLink = `http://www.strava.com/activities/${activity.id}`;

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
          handleSelected(activity, "row");
        }}
      >
        <ListItemAvatar classes={avatarStyles}>
          <div>{index + 1}</div>
        </ListItemAvatar>
        <ListItemText
          primary={activity.name}
          secondary={
            <span className={classes.secondaryText}>
              <span>{infoA}</span>
              <span>{infoB}</span>
              <span>{infoC}</span>
            </span>
          }
        />
      </ListItem>
      {selectedAct.id === activity.id && (
        <div className={classes.actions}>
          <Tooltip title="View on Strava" placement={"top"}>
            <IconButton>
              <a href={stravaLink} rel="noopener noreferrer" target="_blank">
                <img
                  className={classes.stravaIcon}
                  src={"img/strava-icon.svg"}
                  alt="View on Strava"
                />
              </a>
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom to Ride" placement={"top"}>
            <IconButton
              aria-label="zoomToRide"
              onClick={() => {
                centerMapOnActivity(activity);
              }}
            >
              <Map />
            </IconButton>
          </Tooltip>
          <Tooltip title="Remove from map" placement={"top"}>
            <IconButton
              aria-label="delete"
              onClick={() => {
                handleRemoveLine(activity.id);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </div>
  );
}

Row.propTypes = {
  index: PropTypes.number.isRequired,
  activity: PropTypes.object.isRequired,
  selectedAct: PropTypes.shape({
    id: PropTypes.number,
  }),
  handleSelected: PropTypes.func.isRequired,
  handleRemoveLine: PropTypes.func.isRequired,
};

export default Row;
