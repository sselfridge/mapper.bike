import React from 'react';
import PropTypes from 'prop-types';
import RideTitle from './RideTitle'
import DatePicker from 'react-date-picker';


const Sidebar = (props) => {
  // let link = 'https://www.strava.com/oauth/authorize?client_id=16175&redirect_uri=http://localhost:3000/api/strava/callback&response_type=code&approval_prompt=auto&scope=activity:read'

  const titleArray = [];
  if (props.activities) {
    props.activities.forEach((activity,index) => {
      let newTitle = (<RideTitle id={activity.id}
        key={'ride' + activity.id}
        name={activity.name}
        selected={activity.selected} 
        highlightTitle={props.highlightTitle}
        removeAct={props.removeAct} 
        num={index + 1}
        
        />)
      titleArray.push(newTitle);
    })
  }

  if (props.userToken == null) {
    return (
      <div>

        <button className="stravabtn" onClick={props.connectStrava}>Connect with Strava</button>
        <a href={link}> Click this to strava</a>

      </div>
    )
  } else {
    return (
      <div id="sidebar">
        <h3>Map Controls</h3>
        <div id='afterDatePicker'>
        <h5>After Date</h5>
          <DatePicker 
            onChange={props.setAfterDate}
            value={props.afterDate}
          />
        </div>
        <div id='beforeDatePicker'>
        <h5>Before Date</h5>
          <DatePicker 
            onChange={props.setBeforeDate}
            value={props.beforeDate}
          />
        </div>
        <button onClick={props.getActivities}>Get Activities</button>
        <button onClick={props.toggleBlackground}>Hide Map Background</button>
        <div>
          <h2>Rides on map</h2>
        <div id="titleList">
          
            {titleArray}

        </div> 
        </div>
      </div>
    );
  }
};

Sidebar.propTypes = {
  // gameList: PropTypes.array.isRequired,
};

export default Sidebar;
