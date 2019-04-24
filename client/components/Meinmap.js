import React from 'react';
import PropTypes from 'prop-types';
import { map, GoogleApiWrapper } from 'google-maps-react'
import { MapContainer } from './MapContainer';


 const Meinmap = (props) => {
  // const { handleClick, letter, row, square } = props;



  return (
    <div className='map'>
      <MapContainer />
    </div>
  );
};

Meinmap.propTypes = {
  // handleClick: PropTypes.func.isRequired,
  // letter: PropTypes.string,
  // row: PropTypes.number.isRequired,
  // square: PropTypes.number.isRequired
};

export default Meinmap;
 