import React from "react";
import PropTypes from "prop-types";

const RideTitle = props => {
  const { name, id, selected, removeAct, num, startLatLng } = props;
  let lineStyle, removeLink, rideLink, lineBreak;
  let stravaLink = `https://www.strava.com/activities/${id}`;

  if (props.selected == true) {
    lineStyle = "selected";
    rideLink = (
      <a className="rideLink button" href={stravaLink} target="_blank">
        View On Strava
      </a>
    );
    removeLink = (
      <button className="removeLink" onClick={e => props.removeAct(e, id)}>
        Remove
      </button>
    );
    lineBreak = <br />;
  }

  return (
    <div className="activityTitle" id={`ride${id}`}>
      <span
        target="_blank"
        className={lineStyle}
        onClick={e => props.highlightTitle(e, id, startLatLng)}
      >
        {props.num}: {props.name}
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
