import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  makeStyles,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import ControlPanel from "./ControlPanel";
import List from "./List";
import { getEfforts, getUser } from "../../../api/strava";
// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "87.5vh",
    backgroundColor: "#aadaff",
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
  } = props;

  const [panelExpanded, setPanelExpanded] = useState(true);
  const [ranks, setRanks] = React.useState(() => [1]);

  const fetchEfforts = () => {
    console.log("Effect Used");
    getEfforts()
      .then((result) => {
        console.log("result");
        console.log(result);
        setEfforts(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    console.log("Using effect Filter");
    const newFiltered = efforts.filter((effort) => {
      const rank = effort.rank;
      return ranks.indexOf(rank) !== -1;
    });
    setFilteredEfforts(newFiltered);
  }, [ranks, efforts]);

  return (
    <div className={classes.root}>
      <ExpansionPanel id="controlPanel" expanded={panelExpanded}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          onClick={() => setPanelExpanded(!panelExpanded)}
        >
          <Typography className={classes.heading}>
            Control Panel - {filteredEfforts.length} efforts on map
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <ControlPanel fetchEfforts={fetchEfforts} ranks={ranks} setRanks={setRanks} {...props} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <List
        filteredEfforts={filteredEfforts}
        loading={loading}
        panelExpanded={panelExpanded}
        handleSelected={handleSelected}
        selectedAct={selectedAct}
        setMapCenter={setMapCenter}
        handleRemoveLine={handleRemoveLine}
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
