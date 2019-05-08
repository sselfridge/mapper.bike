import React, { Component } from 'react';
import { GoogleApiWrapper, Map, Marker, Polyline, Polygon } from 'google-maps-react'
// import Map from "./Map"
import { MapContainer } from './MapContainer';
import Sidebar from './Sidebar';
import { request } from 'http';

import axios from 'axios';


//functions go here

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // userToken: '16bc607c4adbf5a87d0b2e73284d4f8f8d83ed00',
      userToken: null,
      blackgroundActive: false,
      google: null,
      mapStyles: {
        width: '1200px',
        height: '900px',
        position: 'static'
      },
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      polyLineArray: [],
      currentLine: null,
      activities: [],
      clickedLines: [],
      afterDate: new Date("Mon Apr 01 2019 00:00:00 GMT-0700"),
      beforeDate: new Date("Wed Apr 10 2019 00:00:00 GMT-0700"),
      selectedStrokeWeight: 6,
      defaultStrokeWeight: 2,
    }

    this.selectedActivity = {
      color: '#52eb0c',
      selected: true,
      weight: this.state.selectedStrokeWeight,
      zIndex: 90
    }

    this.notSelectedActivity = {
      color: 'blue',
      selected: false,
      weight: this.state.defaultStrokeWeight,
      zIndex: 2
    }

    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onLineClick = this.onLineClick.bind(this);
    this.connectStrava = this.connectStrava.bind(this); //broken currently
    this.getActivities = this.getActivities.bind(this);
    this.toggleBlackground = this.toggleBlackground.bind(this);
    this.highlightTitle = this.highlightTitle.bind(this);
    this.selectActivity = this.selectActivity.bind(this);
    this.removeAct = this.removeAct.bind(this);
    this.toggleBlackground = this.toggleBlackground.bind(this);
    this.setAfterDate = this.setAfterDate.bind(this);
    this.setBeforeDate = this.setBeforeDate.bind(this);

  }

  //used by clicking a line in the map or hovering over it on the side
  selectActivity(id) {
    let activities = this.state.activities;
    activities.forEach(activity => {
      if (activity.id === id) {
        activity.selected = this.selectedActivity.selected;
        activity.color = this.selectedActivity.color;
        activity.zIndex = this.selectedActivity.zIndex;
        activity.weight = this.selectedActivity.weight;
      } else {
        activity.selected = this.notSelectedActivity.selected
        activity.color = this.notSelectedActivity.color;
        activity.zIndex = this.notSelectedActivity.zIndex;
        activity.weight = this.notSelectedActivity.weight;
      }
    })

    this.setState({ activities });
  }


  onLineClick(e, line, clickPoint) {
    console.log(`Line Clicked!!!`);

    this.selectActivity(line.tag);
  }

  onMarkerClick(props, marker, el) {
    console.log(`Marker Click:`);
    console.log(props);
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    })
  }
  onClose(props) {
    if (true) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  }

  toggleBlackground() {
    let blackground = this.state.blackgroundActive;
    blackground = !blackground;
    this.setState({ blackgroundActive: blackground });
  }

  highlightTitle(e, id) {
    this.selectActivity(id);
  }

  removeAct(e, id) {
    let activities = this.state.activities;
    let deleteIndex;
    activities.forEach((activity, index) => {
      if (activity.id === id) {
        deleteIndex = index;
      }
    })

    activities.splice(deleteIndex, 1);

    this.setState({ activities });
  }

  dateToEpoch(date) {
    let newDate = new Date(date);
    const number = Math.floor(date.getTime() / 1000);
    return number;
  }

  getActivities() {
    console.log('getting activities!!!');
    let beforeDate = '';
    let afterDate = '';
    if (this.state.beforeDate) {
      let epochDate = this.dateToEpoch(this.state.beforeDate);
      beforeDate = `before=${epochDate}&`
    } else {
      beforeDate = `before=${1554147428}&`;
    }
    if (this.state.afterDate) {
      let epochDate = this.dateToEpoch(this.state.afterDate);
      afterDate = `after=${epochDate}&`
    } else {
      afterDate = `after=${1556653028}&`

    }

    const quereyString = `/api/getActivities?${beforeDate}${afterDate}`

    axios.get(quereyString)
      .then(res => {
        // console.log(res.data);
        // let linePoints = res.data.pop();
        this.setState({ activities: res.data })
        console.log(this.state.activities);
        // this.addNewLines();
      })
  }

  setAfterDate(newDate) {
    this.setState({ afterDate: newDate })
  }
  setBeforeDate(newDate) {
    console.log(newDate);
    this.setState({ beforeDate: newDate })
  }

  componentWillMount() {
    // axios.get(`/api/getPath`)
    //   .then(res => {
    //     this.setState({ linePoints: res.data })
    //     this.addNewLines(this.state);
    //   });
  }



  connectStrava(props) {
    console.log('Connect with Strava!');


    axios.get('/api/auth/strava').then((err,result) =>{
      console.log(`Strava Auth worked!!!`);
      console.log(`err: ${err} result:${result}`);
    })
    .catch(err => {
      console.log(`Strava Auth Error: err`);
    })
      


    //this also failed: var cors = require('cors')


    // axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    // axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';

    // let config = {
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    //   }
    // }

    // let config = {
    //   method: 'GET',
    //   mode: 'no-cors',
    //   headers: {
    //     "Access-Control-Allow-Origin": "*",
    //     'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    //   }
    // }

    // fetch(`https://www.strava.com/oauth/authorize?client_id=16175&redirect_uri=http://localhost:3000/api/strava/callback&response_type=code&approval_prompt=auto&scope=activity:read`, config)
    // .then(function(response) {
    //   return response.json();
    // })
    // .then(function(myJson) {
    //   console.log('helllo there');
    //   console.log(JSON.stringify(myJson));
    // });

    // axios.get('/api/stravalogin');

    // axios.get('https://www.strava.com/oauth/authorize?client_id=16175&redirect_uri=http://localhost:3000/api/strava/callback&response_type=code&approval_prompt=auto&scope=activity:read',
    //   {headers: {
    //     "Access-Control-Allow-Origin": "*",
    //   }})

    // axios.post(`/api/stravalogin`);
    //   .then(res => {

    //     console.log(`Back from Strava Req: ${res.body}`);
    //   });


  }



  render() {
    const activities = this.state.activities;
    const polyLineArray = [];

    //create poly line components to add
    activities.forEach((activity, index) => {
      let id = activity.id;
      // console.log(`Adding line: ${id}`);
      let newLine = (<Polyline
        onClick={this.onLineClick}
        path={activity.points}
        tag={id}
        key={'poly' + id}
        strokeColor={this.state.activities[index].color}
        strokeWeight={this.state.activities[index].weight}
        zIndex={this.state.activities[index].zIndex}
      />)
      polyLineArray.push(newLine);
    });

    //create blackground polygon:
    const blackground = (<Polygon
      paths={[{ lat: 54.741332, lng: -146.327752 }, { lat: 56.943, lng: -40.155 }, { lat: -2.63, lng: -45.42 }, { lat: -1.233, lng: -144.217 }, { lat: 54.741332, lng: -146.327752 },]}
      fillColor='black'
      fillOpacity={1}
      clickable={false}
      zIndex={-99}
      visible={this.state.blackgroundActive}

    />)

    if (!this.props.loaded) {
      return (
        <div id="container">
          <div id='board'>Get Activities to fill map</div>
        </div>
      );
    } else {
      return (
        <div id="container">
          <div id='mapControls'>
            <h1>My Map: {this.state.activities.length} Rides</h1>
            <Sidebar
              userToken={this.state.userToken}
              connectStrava={this.connectStrava}
              getActivities={this.getActivities}
              toggleBlackground={this.toggleBlackground}
              activities={this.state.activities}
              highlightTitle={this.highlightTitle}
              removeAct={this.removeAct}
              afterDate={this.state.afterDate}
              setAfterDate={this.setAfterDate}
              beforeDate={this.state.beforeDate}
              setBeforeDate={this.setBeforeDate}
            />
          </div>
          <div id="board">
            <Map
              style={this.state.mapStyles}
              google={this.props.google}
              zoom={11}
              mapTypeId="satellite"
              initialCenter={{
                lat: 33.945602,
                lng: -118.483297
              }}
            >
              {blackground}
              {polyLineArray}
            </Map>


          </div>
        </div>
      );
    }
  }
}
export default GoogleApiWrapper({
  apiKey: 'AIzaSyBrNOaBlCJF1AI8Tb52mc26Bl3Cbda560o',
  libraries: ['geometry', 'visualization'],

})(App);
