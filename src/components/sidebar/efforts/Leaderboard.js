import React from "react";
import PropTypes from "prop-types";

import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core/";

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles((theme) => ({
  Leaderboard: {},
  table: {},
}));

function Leaderboard(props) {
  const classes = useStyles();

  const { leaderboard } = props;

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Place</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Activity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leaderboard.map((row) => (
            <TableRow key={row.activityId}>
              <TableCell component="th" scope="row">
                {row.place}
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell align="right">
                <a
                  href={`https://www.strava.com/activities/${row.activityId}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {row.time}
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

Leaderboard.propTypes = {
  leaderboard: PropTypes.array.isRequired,
};

export default Leaderboard;
