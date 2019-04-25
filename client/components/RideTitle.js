import React from 'react';
import PropTypes from 'prop-types';

const RideTitle = (props) => {
  const { name, id } = props;
  
  return (
    <div className="activityTitle">
    <span>{props.name}</span>
    </div>
  );
};

RideTitle.propTypes = {
  // letters: PropTypes.arrayOf(PropTypes.string).isRequired,
  // handleClick: PropTypes.func.isRequired,
  // row: PropTypes.number.isRequired,
};

export default RideTitle;
