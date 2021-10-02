import React from "react";
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

import { useRowStyles } from "../shared/styles";
import { mergeStyles } from "../../../utils";

// eslint-disable-next-line no-unused-vars
const localStyles = makeStyles((theme) => ({
  detailText: {
    textAlign: "center",
  },
}));

function Row(props) {
  const classes = mergeStyles(useRowStyles(), localStyles());

  let { effort, index, selectedAct, handleSelected, handleRemoveLine } = props;
  const avatarStyles = {
    root: classes.itemNumber,
  };

  const date = moment(effort.date);

  // eslint-disable-next-line no-unused-vars
  const elevation = (effort.elevation * 3.3).toFixed(0);
  const distance = (effort.distance / 1609).toFixed(2);

  const rank = `#${effort.rank}`;
  const distanceMi = `${distance}mi`;
  const athleteCount = `~${effort.athleteCount}`;
  const effortCount = `~${effort.effortCount} efforts`;
  const effortDate = `${date.format("MMM DD 'YY")}`;
  const stravaLink = `http://www.strava.com/segments/${effort.segmentId}`;

  return (
    <div
      id={`row${effort.id}`}
      className={clsx({
        [classes.listItem]: true,
        [classes.selectedStyle]: effort.id === selectedAct.id,
      })}
    >
      <ListItem
        key={index}
        onClick={() => {
          handleSelected(effort, "row");
        }}
      >
        <ListItemAvatar classes={avatarStyles}>
          <div>{index + 1}</div>
        </ListItemAvatar>
        <ListItemText
          primary={effort.name}
          secondary={
            <span className={classes.secondaryText}>
              <span>{rank}</span>
              <span>{distanceMi}</span>

              <span>{effortCount}</span>
              <span>{effortDate}</span>
            </span>
          }
        />
      </ListItem>
      {selectedAct.id === effort.id && (
        <div>
          <p
            className={classes.detailText}
          >{`${effortCount} by ${athleteCount} riders`}</p>
          <div className={classes.actions}>
            <Tooltip title="Remove from map" placement={"top"}>
              <IconButton
                aria-label="delete"
                onClick={() => {
                  handleRemoveLine(selectedAct.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
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
          </div>
        </div>
      )}
    </div>
  );
}

Row.propTypes = {
  index: PropTypes.number.isRequired,
  effort: PropTypes.object.isRequired,
  selectedAct: PropTypes.shape({
    id: PropTypes.string,
  }),
  handleSelected: PropTypes.func.isRequired,
  handleRemoveLine: PropTypes.func.isRequired,
};

export default Row;
