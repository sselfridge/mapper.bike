import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from '@material-ui/core'
import ReactLoading from "react-loading";
import config from "../../config/keys";


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
  },
}));

const DefaultSidebar = props => {

  const {getDemoActivities} = props;



  return (
    <div className="sidebar marginTop">
      <div>
        <a
          href={`https://www.strava.com/oauth/authorize?client_id=${config.client_id}&redirect_uri=${config.callback_uri}/api/strava/callback&response_type=code&approval_prompt=auto&scope=activity:write,activity:read`}
        >
          <img src="client/img/connectStrava.png" />
        </a>
        <span className="demoText">None of your data is kept on our <span title="As if there were more than one...there is not">servers</span></span>
      </div>
      <div id="demoInfo" className="marginTop">
        <br />
        <span className="demoText">Want to try it out without linking your Strava?</span>
        <br />
        <button id="demoBtn" onClick={getDemoActivities}>
          Click Here To Load Demo data
        </button>
      </div>
    </div>
  );
};

export default DefaultSidebar;
