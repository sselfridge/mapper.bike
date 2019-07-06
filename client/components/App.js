import React, { Component } from "react";
import {
  GoogleApiWrapper,
  Map,
  Marker,
  Polyline,
  Polygon
} from "google-maps-react";
// import Map from "./Map"
import Sidebar from "./Sidebar";
import config from "../../config/keys";
import axios from "axios";

//functions go here

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blackgroundActive: false,
      google: null,
      mapStyles: {
        width: "1200px",
        height: "900px",
        position: "static"
      },
      loadingActivites: false,
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
      currentUser: {
        avatar: null,
        firstname: null,
        lastname: null
      },
      center: {
        lat: null,
        lang: null
      }
    };

    this.selectedActivity = {
      color: "#52eb0c",
      selected: true,
      weight: this.state.selectedStrokeWeight,
      zIndex: 90
    };

    this.notSelectedActivity = {
      color: "blue",
      selected: false,
      weight: this.state.defaultStrokeWeight,
      zIndex: 2
    };

    // this.onMarkerClick = this.onMarkerClick.bind(this);
    // this.onClose = this.onClose.bind(this);
    this.onLineClick = this.onLineClick.bind(this);
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
        let element = document.getElementById(`ride${id}`);
        element.scrollIntoView();
        activity.selected = this.selectedActivity.selected;
        activity.color = this.selectedActivity.color;
        activity.zIndex = this.selectedActivity.zIndex;
        activity.weight = this.selectedActivity.weight;
      } else {
        activity.selected = this.notSelectedActivity.selected;
        activity.color = this.notSelectedActivity.color;
        activity.zIndex = this.notSelectedActivity.zIndex;
        activity.weight = this.notSelectedActivity.weight;
      }
    });

    this.setState({ activities });
  }

  onLineClick(e, line, clickPoint) {
    console.log(`Line Clicked!!!`);
    this.selectActivity(line.tag);
  }

  toggleBlackground() {
    let blackground = this.state.blackgroundActive;
    blackground = !blackground;
    this.setState({ blackgroundActive: blackground });
  }

  highlightTitle(e, id) {
    this.selectActivity(id);
    const center = { lat: 56.943, lng: -40.155 };
    this.setState({ center });
  }

  removeAct(e, id) {
    let activities = this.state.activities;
    let deleteIndex;
    activities.forEach((activity, index) => {
      if (activity.id === id) {
        deleteIndex = index;
      }
    });

    activities.splice(deleteIndex, 1);

    this.setState({ activities });
  }

  dateToEpoch(date) {
    let newDate = new Date(date);
    const number = Math.floor(date.getTime() / 1000);
    return number;
  }

  getActivities() {
    console.log("getting activities!!!");
    this.setState({ loadingActivites: true });
    let beforeDate = "";
    let afterDate = "";
    if (this.state.beforeDate) {
      let epochDate = this.dateToEpoch(this.state.beforeDate);
      beforeDate = `before=${epochDate}`;
    } else {
      beforeDate = `before=${9999999999}`;
    }
    if (this.state.afterDate) {
      let epochDate = this.dateToEpoch(this.state.afterDate);
      afterDate = `after=${epochDate}`;
    } else {
      afterDate = `after=${0}`;
    }

    const quereyString = `/api/getActivities?${beforeDate}&${afterDate}&`;

    axios.get(quereyString).then(res => {
      // console.log(res.data);
      // let linePoints = res.data.pop();
      this.setState({ activities: res.data, loadingActivites: false });
      console.log(this.state.activities);
      // this.addNewLines();
    });
  }

  setAfterDate(newDate) {
    this.setState({ afterDate: newDate });
  }
  setBeforeDate(newDate) {
    console.log(newDate);
    this.setState({ beforeDate: newDate });
  }

  componentWillMount() {
    axios.get(`/api/getStravaUser`).then(res => {
      console.log(`User Response`);
      if (res.status === 200) {
        console.log(res.data);
        this.setState({ currentUser: res.data });
      }
    });
  }

  componentWillUpdate() {
    console.log(`Will Update`);
  }

  render() {
    const activities = this.state.activities;
    const polyLineArray = [];



    //create poly line components to add
    console.log("Activities:");
    console.log(activities);
    activities.forEach((activity, index) => {
      let id = activity.id;
      // console.log(`Adding line: ${id}`);
      let newLine = (
        <Polyline
          onClick={this.onLineClick}
          path={activity.points}
          tag={id}
          key={"poly" + id}
          strokeColor={this.state.activities[index].color}
          strokeWeight={this.state.activities[index].weight}
          zIndex={this.state.activities[index].zIndex}
        />
      );
      polyLineArray.push(newLine);
    });

    //create blackground polygon:
    const blackground = (
      <Polygon
        paths={[
          { lat: 54.741332, lng: -146.327752 },
          { lat: 56.943, lng: -40.155 },
          { lat: -2.63, lng: -45.42 },
          { lat: -1.233, lng: -144.217 },
          { lat: 54.741332, lng: -146.327752 }
        ]}
        fillColor="black"
        fillOpacity={1}
        clickable={false}
        zIndex={-99}
        visible={this.state.blackgroundActive}
      />
    );

    if (!this.props.loaded) {
      return (
        <div id="container">
          <div id="board">Get Activities to fill map</div>
        </div>
      );
    } else {
      return (
        <div id="container">
          <div id="mapControls">
            {this.state.currentUser.firstname === null ? (
              // prettier-ignore

              <a className="stravabtn" href={`https://www.strava.com/oauth/authorize?client_id=${config.client_id}&redirect_uri=http://localhost:3000/api/strava/callback&response_type=code&approval_prompt=auto&scope=activity:read`}  >
              Connect With Strava
            </a>
            ) : (
              <div>
                Welcome {this.state.currentUser.firstname}
                <Sidebar
                  getActivities={this.getActivities}
                  toggleBlackground={this.toggleBlackground}
                  activities={this.state.activities}
                  highlightTitle={this.highlightTitle}
                  removeAct={this.removeAct}
                  afterDate={this.state.afterDate}
                  setAfterDate={this.setAfterDate}
                  beforeDate={this.state.beforeDate}
                  setBeforeDate={this.setBeforeDate}
                  loadingActivites={this.state.loadingActivites}
                />
              </div>
            )}
          </div>

          <div id="board">
            <Map
              style={this.state.mapStyles}
              google={this.props.google}
              zoom={11}
              mapTypeId="satellite"
              center={this.state.center}
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

// API is limited to my home IP for development
// TODO add this to config file once pushed live
export default GoogleApiWrapper({
  apiKey: config.mapsApi,
  libraries: ["geometry", "visualization"]
})(App);
