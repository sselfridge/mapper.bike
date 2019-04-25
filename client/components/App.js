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
        width: '1000px',
        height: '900px',
        position: 'static'
      },
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      everyColor: 'red',
      polyLineArray: [],
      currentLine: null,
      activities: [],
      clickedLines: [],
    }



    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onLineClick = this.onLineClick.bind(this);
    this.addNewLines = this.addNewLines.bind(this);
    this.connectStrava = this.connectStrava.bind(this); //broken currently
    this.getActivities = this.getActivities.bind(this);
    this.getActivities2 = this.getActivities2.bind(this);
  }

  onLineClick(props, line, clickPoint) {
    console.log(`Line Clicked!!!`);
    let clickedLines = this.state.clickedLines;
    clickedLines.push(line);
    let currentLine = this.state.currentLine;
    if (currentLine) currentLine.setOptions({ strokeColor: 'red' });

    console.log(`LineID: ${line.tag}`);

    let activities = this.state.activities;
    activities.forEach(activity => {
      console.log("Looking at: ", activity.name);
      if(activity.id === line.tag){
        activity.selected = true;
      } else {
        activity.selected = false;
      }
    })

    console.log(line);
    line.setOptions({ strokeColor: 'blue' });

    this.setState({ currentLine: line , activities , clickedLines});
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

  addNewLines(props) {
    // const activities = this.state.activities;
    // const polyLineArray = [];
    // activities.forEach((activity, index) => {
    //   let id = activity.id;
    //   // console.log(`Adding line: ${id}`);
    //   let newLine = (<Polyline
    //     onClick={this.onLineClick}
    //     path={activity.points}
    //     tag={id}
    //     key={'poly' + id}
    //     strokeColor={this.state.everyColor} />)
    //   polyLineArray.push(newLine);
    // });

    // this.setState({ polyLineArray })
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
    this.state.activities.forEach(act => {
      act.color = 'blue';
    });


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
        strokeColor={this.state.activities[index].color} />)
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
              activities={this.state.activities} />
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
