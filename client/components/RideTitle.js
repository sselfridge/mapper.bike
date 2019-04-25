import React from 'react';
import PropTypes from 'prop-types';

const RideTitle = (props) => {
  const { name, id, selected } = props;
  let lineStyle;
  if(props.selected == true){
    lineStyle = 'selected'
  }

  return (
    <div className="activityTitle">
    <span className={lineStyle}>{props.name}</span>
    </div>
  );
};

RideTitle.propTypes = {
  // letters: PropTypes.arrayOf(PropTypes.string).isRequired,
  // handleClick: PropTypes.func.isRequired,
  // row: PropTypes.number.isRequired,
};

export default RideTitle;
