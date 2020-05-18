import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import List from "../efforts/List";
import { getEfforts } from "../../../api/strava";
// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
}));

const EffortsTab = (props) => {
  const classes = useStyles();

  const {
    efforts,
    setEfforts,
    loading,
    handleSelected,
    selectedAct,
    setMapCenter,
    handleRemoveActivity,
  } = props;

  const [panelExpanded, setPanelExpanded] = useState(true);

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

  return (
    <div className={classes.root}>
      <button onClick={fetchEfforts}>Get Efforts</button>
      <List
        efforts={efforts}
        loading={loading}
        panelExpanded={panelExpanded}
        handleSelected={handleSelected}
        selectedAct={selectedAct}
        setMapCenter={setMapCenter}
        handleRemoveActivity={handleRemoveActivity}
      />
    </div>
  );
};

EffortsTab.propTypes = {
  efforts: PropTypes.array,
  setEfforts: PropTypes.func.isRequired,
  handleSelected: PropTypes.func.isRequired,
  selectedAct: PropTypes.object.isRequired,
  setMapCenter: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  handleRemoveActivity: PropTypes.func.isRequired,
  snackBar: PropTypes.func.isRequired,
};

export default EffortsTab;
