import React from "react";
import PropTypes from "prop-types";
import RideTitle from "./RideTitle";
import DatePicker from "react-date-picker";
import ReactLoading from "react-loading";

const Sidebar = props => {
  // let link = 'https://www.strava.com/oauth/authorize?client_id=16175&redirect_uri=http://localhost:3000/api/strava/callback&response_type=code&approval_prompt=auto&scope=activity:read'

  const loadingActivites = props.loadingActivites ? (
    <div className="loadingActivites">
      <ReactLoading
        type="spinningBubbles"
        color="orange"
        width="100%"
        height={"320px"}
      />
    </div>
  ) : (
    <></>
  );

  const titleArray = [];
  if (props.activities) {
    props.activities.forEach((activity, index) => {
      let newTitle = (
        <RideTitle
          id={activity.id}
          key={"ride" + activity.id}
          name={activity.name}
          selected={activity.selected}
          highlightTitle={props.highlightTitle}
          removeAct={props.removeAct}
          startLatLng = {activity.startLatLng}
          num={index + 1}
        />
      );
      titleArray.push(newTitle);
    });
  }

  return (
    <div id="sidebar">
      <div>
        <div id="afterDatePicker">
          <DatePicker onChange={props.setAfterDate} value={props.afterDate} />
        </div>
        <div id="beforeDatePicker">
          <DatePicker onChange={props.setBeforeDate} value={props.beforeDate} />
        </div>
        <button onClick={props.getActivities}>Get Activities</button>
        <button onClick={props.toggleBlackground}>Secret Feature</button>
        <input className="zipinput" type="text" placeholder="Center on Zip Code" onKeyDown={props.centerOnZip}></input>
        
      </div>
      {loadingActivites}
      <div>
        <h2>{titleArray.length} Rides on map</h2>
        <div id="titleList">{titleArray}</div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  // gameList: PropTypes.array.isRequired,
};

export default Sidebar;
