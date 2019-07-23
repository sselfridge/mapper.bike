import React from "react";
import PropTypes from "prop-types";
import RideTitle from "./RideTitle";
import DatePicker from "react-date-picker";
import ReactLoading from "react-loading";

const Sidebar = props => {
  const loadingActivites = props.loadingActivites ? (
    <div className="loadingActivites">
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
          startLatLng={activity.startLatLng}
          num={index + 1}
        />
      );
      titleArray.push(newTitle);
    });
  }

  return (
    <div id="sidebar">
      <div>
        <span>Date Range:</span>
        <div id="afterDatePicker">
          <DatePicker onChange={props.setAfterDate} value={props.afterDate} />
        </div>
        <div id="beforeDatePicker">
          <DatePicker onChange={props.setBeforeDate} value={props.beforeDate} />
        </div>
        <select onChange={props.setActivityType}>
          <option value="Ride">Ride Only</option>
          <option value="all">All Activities</option>
        </select>
        <br />
        <button onClick={props.getActivities}>Get Activities</button>
        <button onClick={props.toggleBlackground}>Hide Map Background</button>
        <input
          className="zipinput"
          type="text"
          placeholder="Center on Zip Code"
          onKeyDown={props.centerOnZip}
        />
        {flashMessage}
      </div>
      {loadingActivites}
      <div>
        <h2>{titleArray.length} Rides on map</h2>
        <div id="titleList">{titleArray}</div>
      </div>
      <img src="client/img/pwrdBy.svg" />
    </div>
  );
};

Sidebar.propTypes = {
  // gameList: PropTypes.array.isRequired,
};

export default Sidebar;
