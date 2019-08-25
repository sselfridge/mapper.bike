import React from "react";
import PropTypes from "prop-types";
import ReactLoading from "react-loading";
import config from "../../config/keys";

const DefaultSidebar = props => {
  return (
    <div className="sidebar marginTop">
      <div>
        <a
          href={`https://www.strava.com/oauth/authorize?client_id=${config.client_id}&redirect_uri=${config.callback_uri}/api/strava/callback&response_type=code&approval_prompt=auto&scope=activity:read`}
        >
          <img src="client/img/connectStrava.png" />
        </a>
        <span className="demoText">None of your data is kept on our servers</span>
      </div>
      <div id="demoInfo" className="marginTop">
        <br />
        <span className="demoText">Want to try it out without linking your Strava?</span>
        <button id="demoBtn" onClick={props.getDemoActivities}>
          Click Here To Load Demo data
        </button>
      </div>
    </div>
  );
};

export default DefaultSidebar;
