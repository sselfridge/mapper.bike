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
const localStyles = makeStyles((theme) => ({}));

function Row(props) {
  const classes = mergeStyles(useRowStyles(), localStyles());

  let { effort, index, selectedAct, handleSelected, handleRemoveLine } = props;
  const avatarStyles = {
    root: classes.itemNumber,
  };

  const date = moment(effort.date);

  const infoA = `#${effort.rank}`;
  const infoB = `${"165"}mi`;
  const infoC = `${"300"}ft`;
  const infoD = `${date.format("MMM DD 'YY")}`;
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
              <span>{infoA}</span>
              <span>{infoB}</span>
              <span>{infoC}</span>
              <span>{infoD}</span>
            </span>
          }
        />
      </ListItem>
      {selectedAct.id === effort.id && (
        <div className={classes.actions}>
          <Tooltip title="Remove from map" placement={"top"}>
            <IconButton
              aria-label="delete"
              onClick={() => {
                handleRemoveLine(index);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="View on Strava" placement={"top"}>
            <IconButton>
              <a href={stravaLink} rel="noopener noreferrer" target="_blank">
                <img className={classes.stravaIcon} src={"client/img/strava-icon.svg"} />
              </a>
            </IconButton>
          </Tooltip>
        </div>
      )}
    </div>
  );
}

Row.propTypes = {
  index: PropTypes.number.isRequired,
  effort: PropTypes.object.isRequired,
  selectedAct: PropTypes.shape({
    id: PropTypes.number,
  }),
  handleSelected: PropTypes.func.isRequired,
  handleRemoveLine: PropTypes.func.isRequired,
};

export default Row;
