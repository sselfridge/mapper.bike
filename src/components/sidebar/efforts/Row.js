import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import dayjs from "../../../utils/dayjs";
import MapIcon from "@material-ui/icons/Map";
import RefreshIcon from "@material-ui/icons/Refresh";

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
import Leaderboard from "./Leaderboard";

// eslint-disable-next-line no-unused-vars
const localStyles = makeStyles((theme) => ({
  detailText: {
    textAlign: "center",
  },
}));

function Row(props) {
  const classes = mergeStyles(useRowStyles(), localStyles());

  let {
    effort: segEffort,
    index,
    selectedAct,
    handleSelected,
    handleRemoveLine,
    centerMapOnActivity,
    updateLeaderBoard,
  } = props;
  const avatarStyles = {
    root: classes.itemNumber,
  };

  const date = dayjs(segEffort.date);

  // eslint-disable-next-line no-unused-vars
  const elevation = (segEffort.elevation * 3.3).toFixed(0);
  const distance = (segEffort.distance / 1609).toFixed(2);

  const distanceMi = `${distance}mi`;
  const athleteCount = `~${segEffort.athleteCount}`;
  const effortCount = `~${segEffort.effortCount} efforts`;
  const effortDate = `${date.format("MMM DD 'YY")}`;
  const stravaLink = `http://www.strava.com/segments/${segEffort.id}`;

  const currentRank =
    segEffort.currentRanks && Math.min(segEffort.currentRanks);
  const lastUpdate = segEffort.updated || dayjs().format();
  const topRank = Math.min(...segEffort.efforts.map((e) => e.rank));

  const isSelected = selectedAct.id === segEffort.id;

  return (
    <div
      id={`row${segEffort.id}`}
      className={clsx({
        [classes.listItem]: true,
        [classes.selectedStyle]: isSelected,
      })}
    >
      <ListItem
        key={index}
        onClick={() => {
          if (!isSelected) handleSelected(segEffort, "row");
        }}
        onDoubleClick={() => centerMapOnActivity(segEffort)}
      >
        <ListItemAvatar classes={avatarStyles}>
          <div>{index + 1}</div>
        </ListItemAvatar>
        <ListItemText
          primary={segEffort.name}
          secondary={
            <span className={classes.secondaryText}>
              {currentRank && (
                <Tooltip title={lastUpdate}>
                  <span>#{currentRank}</span>
                </Tooltip>
              )}
              <span>#{topRank}</span>
              <span>{distanceMi}</span>

              <span>{effortCount}</span>
              <span>{effortDate}</span>
            </span>
          }
        />
      </ListItem>
      {isSelected && (
        <div>
          <p
            className={classes.detailText}
          >{`${effortCount} by ${athleteCount} riders`}</p>
          <section>
            {segEffort.efforts &&
              segEffort.efforts.map(
                (e) => `${e.date} - ${e.rank} - ${e.activityId}`
              )}
          </section>
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
            <Tooltip title="Update Leaderboard" placement={"top"}>
              <IconButton
                aria-label="updateLeaderboard"
                onClick={() => {
                  updateLeaderBoard(segEffort);
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Zoom to Ride" placement={"top"}>
              <IconButton
                aria-label="zoomToRide"
                onClick={() => {
                  centerMapOnActivity(segEffort);
                }}
              >
                <MapIcon />
              </IconButton>
            </Tooltip>
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
          </div>
          {segEffort.leaderboard && (
            <Leaderboard leaderboard={segEffort.leaderboard} />
          )}
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
