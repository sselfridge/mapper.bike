import React from 'react';
import PropTypes from 'prop-types';
import RideTitle from './RideTitle'

const Sidebar = (props) => {
  // let link = 'https://www.strava.com/oauth/authorize?client_id=16175&redirect_uri=http://localhost:3000/api/strava/callback&response_type=code&approval_prompt=auto&scope=activity:read'

  const titleArray = [];
  if (props.activities) {
    props.activities.forEach(activity => {
      let newTitle = (<RideTitle id={activity.id}
        key={'ride' + activity.id}
        name={activity.name}
        selected={activity.selected} 
        highlightTitle={props.highlightTitle}
        removeAct={props.removeAct} />)
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
      <div id="Sidebar">
        <h3>Map Controls</h3>
        <button onClick={props.getActivities}>Get Activities</button>
        <button onClick={props.getActivities2}>Make them blue!</button>
        <div>
          <h2>Rides on map</h2>
          {titleArray}
        </div>
      </div>
    );
  }
};

Sidebar.propTypes = {
  // gameList: PropTypes.array.isRequired,
};

export default Sidebar;
