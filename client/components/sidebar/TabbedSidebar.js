import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles, Box, AppBar, Tabs, Tab } from "@material-ui/core";

import ActivitiesTab from "./activities/ActivitesTab.jsx";
import EffortsTab from "./efforts/EffortsTab.jsx";

import { getUser } from "../../api/strava";
import UserAgreement from "./UserAgreement.js";
import PremiumOnly from "./PremiumOnly";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  premiumIcon: {
    height: theme.spacing(3),
    width: theme.spacing(3),
    float: "right",
    marginRight: theme.spacing(3),
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

  const [activeTab, setActiveTab] = useState(0);
  const [userAgreed, setUserAgreed] = useState(false);

  const [userInitialized, setUserInitalized] = useState(false);

  const premium = currentUser.premium;

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
          <Tab
            label="KOM Mapper "
            icon={<img className={classes.premiumIcon} src="./client/img/premium.png" />}
            {...a11yProps(1)}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={activeTab} index={0}>
        <ActivitiesTab {...props} />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        {!premium ? (
          <PremiumOnly />
        ) : userInitialized ? (
          <EffortsTab {...props} />
        ) : (
          <UserAgreement userAgreed={userAgreed} setUserAgreed={setUserAgreed} />
        )}
      </TabPanel>
    </div>
  );
}

TabbedSidebar.propTypes = {
  setMapLines: PropTypes.func.isRequired,
  activities: PropTypes.array.isRequired,
  filteredEfforts: PropTypes.array.isRequired,
  currentUser: PropTypes.shape({
    athleteId: PropTypes.number,
    premium: PropTypes.bool,
  }),
};

TabbedSidebar.propTypes = {};
