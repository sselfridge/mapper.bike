import React from "react";
import PropTypes from "prop-types";
import ReactLoading from "react-loading";
import config from "../../config/keys";

// import "./DefaultSidebar.css";

const DefaultSidebar = props => {
  return (
    // prettier-ignore
    <div className="sidebar">
           <a href={`https://www.strava.com/oauth/authorize?client_id=${config.client_id}&redirect_uri=${config.callback_uri}/api/strava/callback&response_type=code&approval_prompt=auto&scope=activity:read`}>
               <img src="client/img/connectStrava.png" />
             </a>
             <span>None of your data is kept on our servers</span>
             <br/>
             <span>Want to try it out without linking your Strava</span>
             <button id="demoBtn" onClick={props.getDemoActivities}>Click Here To Load Demo</button>
       </div>
  );
};


export default DefaultSidebar;
