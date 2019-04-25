import React, { Component } from 'react';
import { GoogleApiWrapper, Map, Marker, Polyline, InfoWindow } from 'google-maps-react'
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
      userToken: '16bc607c4adbf5a87d0b2e73284d4f8f8d83ed00',
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
    }

    this.selectedActivity = {
      color: '#52eb0c',
      selected: true,
      weight: 6,
      zIndex: 90
    }

    this.notSelectedActivity = {
      color: 'blue',
      selected: false,
      weight: 3,
      zIndex: 2
    }

    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onLineClick = this.onLineClick.bind(this);
    this.connectStrava = this.connectStrava.bind(this); //broken currently
    this.getActivities = this.getActivities.bind(this);
    this.getActivities2 = this.getActivities2.bind(this);
    this.highlightTitle = this.highlightTitle.bind(this);
    this.selectActivity = this.selectActivity.bind(this);
    this.removeAct = this.removeAct.bind(this);
  }


  selectActivity(id){
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
    // let clickedLines = this.state.clickedLines;
    // clickedLines.push(line);

    // let currentLine = this.state.currentLine;
    // if (currentLine) {
    //   currentLine.setOptions({ strokeColor: 'red', zIndex: 1, strokeWeight: 3 });
    // }

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


  highlightTitle(e, id) {
    this.selectActivity(id);
  }

  removeAct(e,id){
    let activities = this.state.activities;
    let deleteIndex;
    activities.forEach((activity,index) => {
      if (activity.id === id) {
        deleteIndex = index;
      } 
    })

    activities.splice(deleteIndex,1);

    this.setState({ activities });
  }


  getActivities() {
    console.log('getting activities!!!');
    axios.get("/api/getActivities?numberOf=30&&after=1551404507&before=1556156659")
      .then(res => {
        // console.log(res.data);
        // let linePoints = res.data.pop();
        this.setState({ activities: res.data })
        console.log(this.state.activities);
        // this.addNewLines();
      })
  }

  getActivities2() {
    // console.log('getting activities!!!');
    // axios.get("/api/getActivities?numberOf=30&before=1554082907&after=1551404507")
    //   .then(res => {
    //     // console.log(res.data);
    //     this.setState({ activities: res.data })
    //     this.addNewLines();
    //   })
    // let activities = this.state.activities.map(act => {
    //   // const lastPoint = act.points[act.points.length -1];
    //   const veryLastPoint = {
    //     lat: 34.1234,
    //     lng: -118.1234123 
    //   };
    //   const newPath = act.points.slice();
    //   newPath.push(veryLastPoint);
    //   return {...act, color: 'green', points: newPath};
    // })
    let activities = this.state.activities;
    activities.forEach(act => {
      act.color = "green"
    })

    this.setState({ activities: activities.slice() });


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
            <h1>This is mein map: {this.state.activities.length}</h1>
            <Sidebar
              userToken={this.state.userToken}
              connectStrava={this.connectStrava}
              getActivities={this.getActivities}
              getActivities2={this.getActivities2}
              activities={this.state.activities}
              highlightTitle={this.highlightTitle}
              removeAct={this.removeAct} />
          </div>
          <div id="board">
            <Map
              style={this.state.mapStyles}
              google={this.props.google}
              initialCenter={{
                lat: 34.018958,
                lng: -118.420417
              }}
              mapTypeId="hybrid"
            >
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
