import React from "react";
import PropTypes from "prop-types";
import RideTitle from "./RideTitle";
import DatePicker from "react-date-picker";
import ReactLoading from "react-loading";
import "./Sidebar.css";
import "./Sidebar-Grid.css";

const Sidebar = props => {
  const loadingActivites = props.loadingActivites ? (
    <div className="loadingActivites">
      {/* TODO: Loading Animation for MS Edge */}
      <ReactLoading
        type="spinningBubbles"
        color="#FC4C02"
        width="100%"
        height={"320px"}
      />
    </div>
  ) : (
    <></>
  );

  const flashMessage = props.flashMessage ? (
    <div id="flashMessage">{props.flashMessage}</div>
  ) : (
    <></>
  );

  const demoFog = props.demoMode ? (
    <div id="fogOfDemo">
      <span id="demoText">Controls Not Available in Demo</span>
      <span id='demoInstructions'>Try zip code 80477 or click 'hide map' and zoom out to see rides in other areas.</span>
    </div>
  ) : (
    <></>
  );

  const introMessage =
    props.activities.length === 0 ? (
      <div id="introMessage">
        Click 'Get Activities' to load rides onto map
        <br />
        <br />
        Change Activity type or Date range to get more
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
          midLatLng={activity.midLatLng}
          num={index + 1}
        />
      );
      titleArray.push(newTitle);
    });
  }

  return (
    <div className="sidebar">
      <div id="mapControls">
        {demoFog}
        <span id="dateLabel">Date Range:</span>
        <div id="afterDatePicker">
          <DatePicker onChange={props.setAfterDate} value={props.afterDate} />
        </div>
        <div id="beforeDatePicker">
          <DatePicker onChange={props.setBeforeDate} value={props.beforeDate} />
        </div>
        <label id="typeLabel" forhtml="activityType">
          Activity Type
        </label>
        <select
          id="activityType"
          name="activityType"
          onChange={props.setActivityType}
        >
          <option value="Ride">Ride Only</option>
          <option value="all">All Activities</option>
        </select>

        <button id="getActBtn" onClick={props.getActivities}>
          Get Activities
        </button>
        <button id="hideMapBtn" onClick={props.toggleBlackground}>
          Hide Map
        </button>
        <input
          className="zipinput"
          type="text"
          placeholder="Center on Zip Code"
          onKeyDown={props.centerOnZip}
        />
        {/* mapControls */}
      </div>
      {flashMessage}
      {loadingActivites}
      <div>
        <h2>{titleArray.length} Rides on map</h2>
        {introMessage}
        <div id="titleList">{titleArray}</div>
      </div>
      <a>
        <img src="client/img/pwrdBy.svg" />
      </a>
    </div>
  );
};

Sidebar.propTypes = {
  // List: PropTypes.array.isRequired,
};

export default Sidebar;
