import React, { Component } from 'react';
import { GoogleApiWrapper, Map, Marker, Polyline, InfoWindow } from 'google-maps-react'
// import Map from "./Map"
import { MapContainer } from './MapContainer';
import axios from 'axios';

//functions go here



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userToken: null,
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
  }

  onLineClick(props, line, clickPoint) {
    console.log(`Line Clicked!!!`);

    let currentLine = this.state.currentLine;
    if(currentLine) currentLine.setOptions({strokeColor: 'orange'});

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

  componentWillMount() {
    axios.get(`/api/getPath`)
      .then(res => {
        this.setState({ linePoints: res.data })
        this.addNewLines(this.state);
      });
  }


  render() {
    let positions = [
      { lat: 37.790898, lng: -122.427580 },
      { lat: 37.786969, lng: -122.423733 },
      { lat: 37.786429, lng: -122.434548 }
    ]
    let markerArray = [];

    // google.maps.event.addListener(polyLine, 'click', this.state.onMarkerClick);


    // positions.forEach((position,index) => {
    //   let newMarker =  (< Marker
    //     position={position}
    //     name="asdf"
    //     key={index + "asdf"}
    //   />)
    //   markerArray.push(newMarker);

    // });
    // const { rows, turn, winner, gameList } = this.state;
    // const handleClick = this.handleClick;

    // const rowElements = rows.map((letters, i) => (
    //   <Row key={i} row={i} letters={letters} handleClick={handleClick} />
    // ));




    if (!this.props.loaded || this.state.polyLineArray.length == 0) {
      return (
        <div id='board'>Map Loading...maybe</div>
      );
    } else {
      return (
        <div id="container">
          <h1>This is mein map: {this.state.polyLineArray.length}</h1>
          <div id="board">
            <Map
              style={this.state.mapStyles}
              google={this.props.google}
              initialCenter={{
                lat: 34.018958,
                lng: -118.420417
              }}
            >
              {this.state.polyLineArray}
              <Marker
                onClick={this.onMarkerClick}
                name={'Kenyatta International Convention'}
              />
              <InfoWindow
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}
                onClose={this.onClose}
              >
                <div>
                  <h4>{this.state.selectedPlace.name}</h4>
                </div>
              </InfoWindow>
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
