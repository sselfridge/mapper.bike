/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";

const RideTitle = (props) => {
  const {
    name,
    id,
    dateInt,
    distance,
    elapsedTime,
    selected,
    removeAct,
    num,
    midLatLng,
    highlightTitle,
  } = props;
  let removeLink, rideLink, lineBreak, rideInfo;
  let selectedTitle = "";
  let stravaLink = `https://www.strava.com/activities/${id}`;

  if (selected === true) {
    selectedTitle = "selectedTitle";
    rideLink = (
      <a className="rideLink button" href={stravaLink} rel="noopener noreferrer" target="_blank">
        View On Strava
      </a>
    );
    removeLink = (
      <a className="removeLink" onClick={(e) => removeAct(e, id)}>
        Remove
      </a>
    );
    lineBreak = <br />;

    const dateObj = new Date(dateInt * 1000);
    const readableDate = `${dateObj.toLocaleString("default", {
      month: "long",
    })} ${dateObj.getDate()}`;

    const distanceMiles = distance / 1609;
    const totalHours = elapsedTime / 3600;
    const hours = Math.floor(totalHours);
    const minutes = Math.floor((totalHours - hours) * 60);
    rideInfo = (
      <div className="rideInfo">
        <span className="rideInfoDate">{readableDate}</span>
        <span className="rideInfoDistance">{distanceMiles.toFixed(2)} mi</span>
        <br></br>
        <span> </span>
        <span className="rideInfoElapsedTime">
          {hours}:{minutes} hrsasdf
        </span>
      </div>
    );
  }

  return (
    <div className={`activityTitle ${selectedTitle}`} id={`ride${id}`}>
      <span target="_blank" onClick={(e) => highlightTitle(e, id, midLatLng)}>
        {selected ? "" : `${num} :`} {name}
      </span>
      {lineBreak}
      {rideInfo}
      {lineBreak}
      {removeLink}
      {rideLink}
    </div>
  );
};

RideTitle.propTypes = {
  // letters: PropTypes.arrayOf(PropTypes.string).isRequired,
  // handleClick: PropTypes.func.isRequired,
  // row: PropTypes.number.isRequired,
};

export default RideTitle;
