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

  let { item, index, selectedAct, handleSelected, handleRemoveActivity } = props;
  const effort = item;
  const avatarStyles = {
    root: classes.itemNumber,
  };

  let infoA, infoB, infoC, stravaLink;
  const date = moment(effort.date);

  infoA = `Rank: ${effort.rank}`;
  infoB = "";
  infoC = `Date: ${date.format("MMM DD YY")}`;
  stravaLink = `http://www.strava.com/segments/${activity.segmentId}`;

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
                handleRemoveActivity(index);
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
  item: PropTypes.object.isRequired,
  selectedAct: PropTypes.shape({
    id: PropTypes.number,
  }),
  handleSelected: PropTypes.func.isRequired,
  handleRemoveActivity: PropTypes.func.isRequired,
};

export default Row;
