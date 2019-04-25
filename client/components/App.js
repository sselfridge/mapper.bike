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
      linePoints: [],
      everyColor: 'green',
      polyLineArray: [],
      currentLine: null
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

    let currentLine = this.state.currentLine;
    if (currentLine) currentLine.setOptions({ strokeColor: 'orange' });

    console.log(line);
    console.log(props);
    line.setOptions({ strokeColor: 'blue' });

    this.setState({ currentLine: line });
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

    let polyLineArray = this.state.polyLineArray;
    this.state.linePoints.forEach((path, index) => {
      let tag = 'poly' + index;

      console.log(`Adding line: ${tag}`);
      let newLine = (<Polyline
        onClick={this.onLineClick}
        path={path}
        tag={tag}
        key={tag}
        strokeColor={this.state.everyColor} />)
      polyLineArray.push(newLine);
    });

    this.setState({ polyLineArray })
  }

  getActivities() {
    console.log('getting activites!!!');
    axios.get("/api/getActivities?numberOf=30&&after=1551404507&before=1556156659").then(res => {
      // console.log(res.data);
      // let linePoints = res.data.pop();
      this.setState({ linePoints: linePoints })
      this.addNewLines(this.state);
    })
  }

  getActivities2() {
    console.log('getting activites!!!');
    axios.get("/api/getActivities?numberOf=30&before=1554082907&after=1551404507").then(res => {
      // console.log(res.data);
      let linePoints = res.data.pop();
      this.setState({ linePoints: linePoints })
      this.addNewLines(this.state);
    })
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




    if (!this.props.loaded) {
      return (
        <div id="container">
          <div id='mapControls'>
            <h1>Rides on Map: {this.state.polyLineArray.length}</h1>          
          </div>
          <div id='board'>Get Activities to fill map</div>
        </div>
      );
    } else {
      return (
        <div id="container">
          <div id='mapControls'>
            <h1>This is mein map: {this.state.polyLineArray.length}</h1>
            <Sidebar
              userToken={this.state.userToken}
              connectStrava={this.connectStrava}
              getActivities={this.getActivities} 
              getActivities2={this.getActivities2} />
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
              {this.state.polyLineArray}
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
