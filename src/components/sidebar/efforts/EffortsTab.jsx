import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import dayjs from "../../../utils/dayjs";

import ControlPanel from "./ControlPanel";
import List from "./List";
import { getEfforts, refreshLeaderboard } from "../../../api/strava";
import { sideBarHeight } from "../../../constants/sidebar";
import { useCallback } from "react";

const { appendLeaderboard } = require("../../../utils/helperFunctions");

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles((theme) => ({
  root: {
    height: sideBarHeight,
    backgroundColor: theme.palette.background,
  },
  panelSummary: {
    display: "flex",
    justifyContent: "space-between",
    flexGrow: 1,
  },
  panelDetails: {
    padding: 0,
  },
  loadingEfforts: {
    margin: "0px 10px",
  },
}));

const EffortsTab = (props) => {
  const classes = useStyles();

  const {
    efforts,
    setEfforts,
    filteredEfforts,
    setFilteredEfforts,
    loading,
    handleSelected,
    selectedAct,
    setMapCenter,
    handleRemoveLine,
    centerMapOnActivity,
    renderKomTab,
  } = props;

  const [panelExpanded, setPanelExpanded] = useState(true);
  const [ranks, setRanks] = useState(() => [1]);
  const [sortBy, setSortBy] = useState("");
  const [sortDir, setSortDir] = useState("asc");
  const [loadingEfforts, setLoadingEfforts] = useState(false);

  const fetchEfforts = useCallback(() => {
    setLoadingEfforts(true);
    getEfforts()
      .then((result) => {
        setEfforts(result);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoadingEfforts(false);
      });
  }, [setEfforts]);

  const updateLeaderBoard = async (effort) => {
    const leaderboard = await refreshLeaderboard(effort);

    const { segmentId, activityId } = effort;

    const updated = dayjs().format();

    setFilteredEfforts((oldEfforts) => {
      const efforts = oldEfforts.slice();

      efforts.forEach((e) => {
        if (e.segmentId === segmentId) {
          const currentRank = appendLeaderboard(activityId, leaderboard);
          e.currentRank = currentRank;
          e.updated = updated;
        }
      });
      return efforts;
    });
  };

  const sortEfforts = useCallback(
    (efforts) => {
      if (!sortBy) return efforts;

      let sorted = efforts.slice();

      sorted = sorted.sort((a, b) => {
        let aVal, bVal;
        if (sortBy === "date") {
          aVal = new Date(a.date).valueOf();
          bVal = new Date(b.date).valueOf();
        } else {
          aVal = a[sortBy] ? a[sortBy] : 1;
          bVal = b[sortBy] ? b[sortBy] : 1;
        }

        if (sortDir === "asc") {
          return aVal - bVal;
        } else {
          return bVal - aVal;
        }
      });
      return sorted;
    },
    [sortBy, sortDir]
  );

  useEffect(() => {
    //Filter By Rank
    const newFiltered = efforts.filter((effort) => {
      const rank = effort.rank;

      return (
        ranks.indexOf(rank) !== -1 && effort.line && effort.line !== "error"
      );
    });

    const sorted = sortEfforts(newFiltered);

    setFilteredEfforts(sorted);
  }, [ranks, efforts, sortBy, sortDir, setFilteredEfforts, sortEfforts]);

  useEffect(() => {
    fetchEfforts();
  }, [fetchEfforts, renderKomTab]);

  return (
    <div className={classes.root}>
      <Accordion id="controlPanel" expanded={panelExpanded}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          onClick={() => setPanelExpanded((val) => !val)}
        >
          <div className={classes.panelSummary}>
            <Typography variant="h6">Control Panel</Typography>
            {loadingEfforts ? (
              <CircularProgress size={24} className={classes.loadingEfforts} />
            ) : (
              <Typography className={classes.headingInfo}>
                {`${filteredEfforts.length} of ${efforts.length} efforts`}
              </Typography>
            )}
          </div>
        </AccordionSummary>
        <AccordionDetails classes={{ root: classes.panelDetails }}>
          <ControlPanel
            fetchEfforts={fetchEfforts}
            ranks={ranks}
            setRanks={setRanks}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortDir={sortDir}
            setSortDir={setSortDir}
            {...props}
          />
        </AccordionDetails>
      </Accordion>
      <List
        filteredEfforts={filteredEfforts}
        loading={loading}
        panelExpanded={panelExpanded}
        handleSelected={handleSelected}
        selectedAct={selectedAct}
        setMapCenter={setMapCenter}
        handleRemoveLine={handleRemoveLine}
        centerMapOnActivity={centerMapOnActivity}
        updateLeaderBoard={updateLeaderBoard}
      />
    </div>
  );
};

EffortsTab.propTypes = {
  efforts: PropTypes.array,
  setEfforts: PropTypes.func.isRequired,
  filteredEfforts: PropTypes.array,
  setFilteredEfforts: PropTypes.func.isRequired,
  handleSelected: PropTypes.func.isRequired,
  selectedAct: PropTypes.object.isRequired,
  setMapCenter: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  handleRemoveLine: PropTypes.func.isRequired,
  snackBar: PropTypes.func.isRequired,
};

export default EffortsTab;
