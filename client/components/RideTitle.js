import React from 'react';
import PropTypes from 'prop-types';

const RideTitle = (props) => {
  const { name, id, selected, removeAct,num } = props;
  let lineStyle, removeLink, rideLink, lineBreak;
  let stravaLink = `https://www.strava.com/activities/${id}`
  
  if (props.selected == true) {
    lineStyle = 'selected'
    rideLink = <button className="rideLink" href={stravaLink} target="_blank">View On Strava</button>
    removeLink = <button className='removeLink' onClick={e => props.removeAct(e, id)}>Remove</button>
    lineBreak = <br />

  }

  return (
    <div className="activityTitle">
      <span target="_blank" className={lineStyle}
        onClick={e => props.highlightTitle(e, id)}  >
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
