import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import { Switch, Button, Select, FormControl, MenuItem, Tooltip } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import CenterFocusWeakOutlinedIcon from "@material-ui/icons/CenterFocusWeakOutlined";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import AllInclusiveOutlinedIcon from "@material-ui/icons/AllInclusiveOutlined";

import InputLabel from "../../styledMui/InputLabel";
import CenterMapModal from "../shared/CenterMapModal";
import RankFilter from "./RankFilter";
import RankColor from "./RankColor";
import { fullRankArray } from "../../../constants/sidebar";

const useStyles = makeStyles((theme) => ({
  root: {},

  centerMap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  formControl: {
    width: 120,
  },
  icon: {
    height: theme.spacing(4),
    width: theme.spacing(4),
    cursor: "pointer",
    margin: "auto",
  },
  mapControls: {
    display: "flex",
    // margin: theme.spacing(1, 0),
  },
  rankSwitch: {
    display: "flex",
  },
  rankControls: {
    display: "flex",
    justifyContent: "space-between",
  },
  toggleAll: {
    alignSelf: "flex-end",
  },
}));

const ControlPanel = (props) => {
  const classes = useStyles();

  const {
    blackgroundActive,
    setBlackground,
    fetchEfforts,
    setMapCenter,
    snackBar,
    ranks,
    setRanks,
    rankColors,
    setRankColors,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
  } = props;

  const [showCenterModal, setShowCenterModal] = useState(false);
  const [rankFilterOrColor, setRankFilterOrColor] = useState(true);
  const [allRankToggle, setAllRankToggle] = useState([]);

  const handleToggleRank = (event, newRank) => {
    setRanks(newRank);
  };

  const handleToggleAllRank = () => {
    const len = allRankToggle.length;
    if (len === 0) {
      setAllRankToggle([1]);
      setRanks(fullRankArray);
    } else {
      setAllRankToggle([]);
      setRanks([]);
    }
  };

  useEffect(() => {
    const len = ranks.length;
    if (len === 10) {
      setAllRankToggle(fullRankArray);
    } else {
      setAllRankToggle([]);
    }
  }, [ranks]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const switchSortDir = () => {
    if (sortDir === "asc") {
      setSortDir("dsc");
    } else {
      if (sortDir === "dsc") setSortDir("asc");
    }
  };

  const sortIcon = sortDir === "asc" ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />;

  return (
    <div className={classes.root}>
      <div>
        <section>
          <Button
            onClick={() => fetchEfforts()}
            className={classes.getBtn}
            variant="contained"
            color="primary"
          >
            Reset Efforts
          </Button>
        </section>
        <section>
          <div>
            <div className={classes.rankControls}>
              <div className={classes.rankSwitch}>
                <InputLabel>Filter by Rank</InputLabel>
                <Switch
                  checked={!rankFilterOrColor}
                  onChange={() => {
                    setRankFilterOrColor(!rankFilterOrColor);
                  }}
                />
                <InputLabel>Set Colors</InputLabel>
              </div>
              {rankFilterOrColor && (
                <ToggleButtonGroup
                  className={classes.toggleAll}
                  value={allRankToggle}
                  onChange={handleToggleAllRank}
                >
                  <ToggleButton value={1}>
                    <Tooltip title="Toggle All Ranks">
                      <AllInclusiveOutlinedIcon />
                    </Tooltip>
                  </ToggleButton>
                </ToggleButtonGroup>
              )}
            </div>
            {rankFilterOrColor && (
              <RankFilter
                ranks={ranks}
                handleToggleRank={handleToggleRank}
                rankColors={rankColors}
              />
            )}
            {!rankFilterOrColor && (
              <RankColor rankColors={rankColors} setRankColors={setRankColors} />
            )}
          </div>
        </section>
      </div>
      <div className={classes.mapControls}>
        <section>
          <InputLabel>Hide Map</InputLabel>
          <Switch
            value={blackgroundActive}
            onChange={() => {
              setBlackground(!blackgroundActive);
            }}
          />
        </section>
        <section className={classes.centerMap}>
          <InputLabel>Center Map</InputLabel>
          <CenterFocusWeakOutlinedIcon
            onClick={() => setShowCenterModal(true)}
            className={classes.icon}
          />
        </section>
        <section>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-helper-label">Sort By</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={sortBy}
              onChange={handleSortChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"rank"}>Rank</MenuItem>
              <MenuItem value={"distance"}>Distance</MenuItem>
              <MenuItem value={"effortCount"}>Effort Count</MenuItem>
            </Select>
          </FormControl>
        </section>
        {sortBy !== "" && (
          <section onClick={switchSortDir}>
            <InputLabel>SortDir</InputLabel>
            {sortIcon}
          </section>
        )}
      </div>

      <CenterMapModal
        showCenterModal={showCenterModal}
        setShowCenterModal={setShowCenterModal}
        setMapCenter={setMapCenter}
        snackBar={snackBar}
      />
    </div>
  );
};

ControlPanel.propTypes = {
  blackgroundActive: PropTypes.bool.isRequired,
  setBlackground: PropTypes.func.isRequired,
  fetchEfforts: PropTypes.func.isRequired,

  setMapCenter: PropTypes.func.isRequired,

  snackBar: PropTypes.func.isRequired,
  ranks: PropTypes.array.isRequired,
  setRanks: PropTypes.func.isRequired,
  rankColors: PropTypes.array.isRequired,
  setRankColors: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  setSortBy: PropTypes.func.isRequired,
  sortDir: PropTypes.string.isRequired,
  setSortDir: PropTypes.func.isRequired,
};

export default ControlPanel;
