import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import dayjs from "../../../utils/dayjs";
import MapIcon from "@material-ui/icons/Map";
import RefreshIcon from "@material-ui/icons/Refresh";
import LeaderboardIcon from "@material-ui/icons/FormatListNumbered";

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
  myEffortsTable: {
    textAlign: "right",
    width: "80%",
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

  const [showLeaderBoard, setShowLeaderBoard] = useState(false);

  const date = dayjs(segEffort.date);

  // eslint-disable-next-line no-unused-vars
  const elevation = (segEffort.elevation * 3.3).toFixed(0);
  const distance = (segEffort.distance / 1609).toFixed(2);

  const distanceMi = `${distance}mi`;
  const athleteCount = `~${segEffort.athleteCount}`;
  const effortCount = `~${segEffort.effortCount} attempts`;
  const effortDate = `${date.format("MMM DD 'YY")}`;
  const stravaLink = `http://www.strava.com/segments/${segEffort.id}`;

  let currentRank =
    segEffort.currentRanks &&
    Math.min(segEffort.currentRanks.filter((a) => typeof a === "number"));

  currentRank = currentRank === 0 ? "--" : currentRank;

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
          <table className={classes.myEffortsTable}>
            <tr>
              <td>My Efforts</td>
              <td>Date</td>
              <td>Rank</td>
            </tr>

            {segEffort.efforts &&
              segEffort.efforts.map((e) => {
                const effortDate = dayjs(e.date).format("MM/DD/YY");
                return (
                  <tr>
                    <td />
                    <td>
                      <a
                        href={`https://www.strava.com/activities/${e.activityId}`}
                      >
                        {effortDate}
                      </a>
                    </td>
                    <td>{e.rank}</td>
                  </tr>
                );
              })}
          </table>
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
                  setShowLeaderBoard(true);
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
            {segEffort.leaderboard && (
              <Tooltip title="View leaderboard" placement={"top"}>
                <IconButton
                  aria-label="delete"
                  onClick={() => setShowLeaderBoard((v) => !v)}
                >
                  <LeaderboardIcon />
                </IconButton>
              </Tooltip>
            )}
          </div>
          {segEffort.leaderboard && showLeaderBoard && (
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
