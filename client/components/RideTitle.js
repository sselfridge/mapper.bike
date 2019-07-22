import React from "react";
import PropTypes from "prop-types";

const RideTitle = props => {
  const { name, id, selected, removeAct, num, startLatLng,highlightTitle } = props;
  let removeLink, rideLink, lineBreak;
  let selectedStyle = "";
  let stravaLink = `https://www.strava.com/activities/${id}`;

  if (selected == true) {
    selectedStyle = "selected";
    rideLink = (
      <a className="rideLink button" href={stravaLink} target="_blank">
        View On Strava
      </a>
    );
    removeLink = (
      <a className="removeLink button" onClick={e => removeAct(e, id)}>
        Remove from map
      </a>
    );
    lineBreak = <br />;
  }

  return (
    <div className={`activityTitle ${selectedStyle}`} id={`ride${id}`}>
      <span
        target="_blank"
        onClick={e => highlightTitle(e, id, startLatLng)}
      >
        {num}: {name}
      </span>
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
