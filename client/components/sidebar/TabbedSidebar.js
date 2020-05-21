import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

import ActivitiesTab from "./activities/ActivitesTab.jsx";
import EffortsTab from "./efforts/EffortsTab.jsx";

import { getUser } from "../../api/strava";
import UserAgreement from "./UserAgreement.js";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

// const TabbedSidebar = (props) => {
//   const { getDemoActivities } = props;

//   return <div className="sidebar marginTop">SideVAR!!</div>;
// };

// export default TabbedSidebar;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function TabbedSidebar(props) {
  const classes = useStyles();

  const { setMapLines, activities, filteredEfforts, currentUser } = props;

  const [activeTab, setActiveTab] = useState(1);
  const [userAgreed, setUserAgreed] = useState(false);

  const [userInitialized, setUserInitalized] = useState(false);

  const handleChange = (event, newValue) => {
    syncLines(newValue);
    setActiveTab(newValue);
  };

  const syncLines = (tabIndex) => {
    switch (tabIndex) {
      case 0:
        setMapLines(activities);
        break;
      case 1:
        setMapLines(filteredEfforts);
        break;

      default:
        throw new Error("Invalid Tab Recieved: ", tabIndex);
    }
  };

  useEffect(() => {
    console.log("Effect Used", activeTab);
    syncLines(activeTab);
  }, [activities, filteredEfforts]);

  useEffect(() => {
    const id = currentUser.athleteId;
    getUser(id).then((user) => {
      if (user) setUserInitalized(true);
    });
  }, []);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={activeTab} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Activities" {...a11yProps(0)} />
          <Tab label="KOM Mapper " {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={activeTab} index={0}>
        <ActivitiesTab {...props} />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        {userInitialized ? (
          <EffortsTab {...props} />
        ) : (
          <UserAgreement userAgreed={userAgreed} setUserAgreed={setUserAgreed} />
        )}
      </TabPanel>
    </div>
  );
}

TabbedSidebar.propTypes = {};
