import React from 'react';
import PropTypes from 'prop-types';

const RideTitle = (props) => {
  const { name, id, selected,removeAct } = props;
  let lineStyle,removeLink;
  let stravaLink = `https://www.strava.com/activities/${id}`
  if (props.selected == true) {
    lineStyle = 'selected'
    removeLink = <a className='removeLink' onClick={e => props.removeAct(e,id)}>Remove</a>
  }

  return (
    <div className="activityTitle">
      <a href={stravaLink} target="_blank" className={lineStyle}
        onMouseOver={e => props.highlightTitle(e,id)}  >
        {props.name}
      </a> {removeLink}
    </div>
  );
};

RideTitle.propTypes = {
  // letters: PropTypes.arrayOf(PropTypes.string).isRequired,
  // handleClick: PropTypes.func.isRequired,
  // row: PropTypes.number.isRequired,
};

export default RideTitle;
