import React, { Component } from "react";
import { GoogleApiWrapper, Map, Polyline, Polygon } from "google-maps-react";
import Sidebar from "./Sidebar";
import DefaultSidebar from "./DefaultSidebar";
import config from "../../config/keys";
import axios from "axios";

import HeaderRight from "./HeaderRight";

// Get git version from ENV var
// eslint-disable-next-line no-undef
const version = VERSION;

//functions go here
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blackgroundActive: false,
      google: null,
      mapStyles: {
        width: "calc(100% - 360px)",
        height: "calc(100% - 55px)",
      },
      loadingActivities: false,
      activeMarker: {},
      selectedPlace: {},
      polyLineArray: [],
      currentLine: null,
      activities: [],
      clickedLines: [],
      afterDate: new Date(),
      beforeDate: new Date(),
      activityType: { Ride: true, VirtualRide: false, Run: false },
      selectedStrokeWeight: 6,
      defaultStrokeWeight: 2,
      currentUser: {
        avatar: null,
        firstname: null,
        lastname: null,
        althleteId: null,
      },
      center: {
        lat: null,
        lang: null,
      },
      flashMessage: "",
      demoMode: false,
      dimScreen: false,
      showMenu: false,
    };

    this.selectedActivity = {
      color: "#52eb0c",
      selected: true,
      weight: this.state.selectedStrokeWeight,
      zIndex: 90,
    };

    this.notSelectedActivity = {
      color: "blue",
      selected: false,
      weight: this.state.defaultStrokeWeight,
      zIndex: 2,
    };

    this.onLineClick = this.onLineClick.bind(this);
    this.getActivities = this.getActivities.bind(this);
    this.getDemoActivities = this.getDemoActivities.bind(this);
    this.toggleBlackground = this.toggleBlackground.bind(this);
    this.highlightTitle = this.highlightTitle.bind(this);
    this.selectActivity = this.selectActivity.bind(this);
    this.removeAct = this.removeAct.bind(this);
    this.toggleBlackground = this.toggleBlackground.bind(this);
    this.setAfterDate = this.setAfterDate.bind(this);
    this.setBeforeDate = this.setBeforeDate.bind(this);
    this.setActivityType = this.setActivityType.bind(this);
    this.centerOnLocation = this.centerOnLocation.bind(this);
    this.flashMessage = this.flashMessage.bind(this);
    this.stravaLogout = this.stravaLogout.bind(this);
    this.toggleDim = this.toggleDim.bind(this);
    this.toggleShowMenu = this.toggleShowMenu.bind(this);
    this.test = this.test.bind(this);
  }

  //used by clicking a line in the map or hovering over it on the side
  selectActivity(id) {
    let activities = this.state.activities;
    activities.forEach((activity) => {
      if (activity.id === id) {
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

  onLineClick(e, line) {
    console.log(`Line Clicked!!!`);
    const id = line.tag;
    const rideEl = document.getElementById(`ride${id}`);
    rideEl.scrollIntoView({
      behavior: "auto",
      block: "center",
      inline: "center",
    });

    this.selectActivity(id);
  }

  toggleBlackground() {
    let blackground = this.state.blackgroundActive;
    blackground = !blackground;
    this.setState({ blackgroundActive: blackground });
  }

  highlightTitle(e, id, midLatLng) {
    this.selectActivity(id);
    const center = { lat: midLatLng[0], lng: midLatLng[1] };
    this.setState({ center });
  }

  //TODO
  //worker function to calculate the map extremes of each activity to find a mid point
  //Also calculate distance and change zoom as needed
  findCenterAndZoom() {}

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
    const number = Math.floor(date.getTime() / 1000);
    return number;
  }

  getActivities() {
    console.log("getActivities()");
    this.setState({ loadingActivities: true });
    let beforeDate = "";
    let afterDate = "";
    let activityType = "type=''";
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
    if (this.state.activityType !== "") {
      activityType = `type=${JSON.stringify(this.state.activityType)}`;
    }

    const quereyString = `/api/summaryActivities?${beforeDate}&${afterDate}&${activityType}`;

    axios.get(quereyString).then((res) => {
      this.setState({ activities: res.data, loadingActivities: false });
    });
  }

  test() {
    const quereyString = "/api/test";
    axios.get(quereyString).then((res) => {
      console.log(res);
    });
  }

  getDemoActivities() {
    this.setState({ loadingActivities: true });
    axios.get("/api/getDemoData").then((res) => {
      this.setState({
        activities: res.data,
        loadingActivities: false,
        demoMode: true,
      });
    });
  }

  setAfterDate(newDate) {
    this.setState({ afterDate: newDate });
  }
  setBeforeDate(newDate) {
    console.log(`New Before Date ${newDate}`);
    this.setState({ beforeDate: newDate });
  }
  setActivityType(type) {
    console.log("set Type");
    document.getElementById(`type${type}`).classList.toggle("typeSelected");
    const activityType = this.state.activityType;
    activityType[type] = !activityType[type];
    this.setState({ activityType });
  }

  centerOnLocation(e) {
    if (e.key === "Enter") {
      // console.log('Looking up:',e.target.value);
      const address = encodeURIComponent(e.target.value);
      const GOOGLE_API = "https://maps.google.com/maps/api/geocode/json";
      let url = GOOGLE_API + `?key=${config.mapsApi}` + `&address=${address}`;
      axios
        .get(url)
        .then((response) => {
          console.log(response.data);
          if (response.data.status === "ZERO_RESULTS") {
            this.flashMessage("Location not found");
            return;
          }
          const { lat, lng } = response.data.results[0].geometry.location;
          this.setState({ center: { lat, lng } });
        })
        .catch((error) => {
          console.error(error);
          this.flashMessage("Error with location - try another query");
        });
    } //if e.key
  }

  // centerOnZip(e) {
  //   if (e.key === "Enter") {
  //     if (!/^\d{5}/.test(e.target.value)) {
  //       this.flashMessage("5 Digit US zipcodes only");
  //       return;
  //     } //only query if zip is 5 numbers
  //     axios
  //       .get(`/api/getLatLngZip/${e.target.value}`)
  //       .then(res => {
  //         if (res.data) {
  //           this.setState({ center: res.data });
  //         }
  //       })
  //       .catch(err => {
  //         this.flashMessage("5 Digit US zipcodes only");
  //       });
  //   }
  // }

  flashMessage(message) {
    const flashMessage = message;
    this.setState({ flashMessage });

    setTimeout(() => {
      this.setState({ flashMessage: "" });
    }, 5000);
  }

  stravaLogout() {
    axios.get("/api/logout").then((res) => {
      console.log("User Logged Out", res.status);

      if (res.status === 200) {
        const emptyUser = {
          avatar: null,
          firstname: null,
          lastname: null,
        };
        this.setState({ currentUser: emptyUser, demoMode: false });
      }
    });
  }

  toggleShowMenu() {
    const showMenu = !this.state.showMenu;
    const dimScreen = showMenu;
    this.setState({ dimScreen, showMenu });
  }

  toggleDim() {
    const dimScreen = !this.state.dimScreen;
    const showMenu = false;
    this.setState({ dimScreen, showMenu });
  }

  componentDidMount() {
    axios.get(`/api/getStravaUser`).then((res) => {
      if (res.status === 200) {
        this.setState({ currentUser: res.data });
      }
    });
    const afterDate = new Date();
    afterDate.setMonth(afterDate.getMonth() - 2);
    this.setState({ afterDate });

    // // Uncomment to activate Demo on default
    // if(this.state.demoMode === false){
    //   this.getDemoActivities()
    // }
  }

  render() {
    const activities = this.state.activities;
    const polyLineArray = [];

    //create poly line components to add
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
    const blackground = [
      <Polygon
        paths={[
          { lat: 89, lng: -179 },
          { lat: 89, lng: 1 },
          { lat: -60, lng: 1 },
          { lat: -60, lng: -179 },
          { lat: 89, lng: -179 },
        ]}
        key="blackground0"
        fillColor="black"
        fillOpacity={1}
        clickable={false}
        zIndex={-99}
        visible={this.state.blackgroundActive}
      />,
      <Polygon
        paths={[
          { lat: 89, lng: -180 },
          { lat: 89, lng: 1 },
          { lat: -60, lng: 1 },
          { lat: -60, lng: -180 },
          { lat: 89, lng: -180 },
        ]}
        key="blackground1"
        fillColor="black"
        fillOpacity={1}
        clickable={false}
        zIndex={-99}
        visible={this.state.blackgroundActive}
      />,
    ];
    // console.debug(`App ENV:${process.env.NODE_ENV}`);
    // console.debug(`client: ${config.client_id}`);

    const dimScreen = this.state.dimScreen ? (
      <div id="dimScreen" onClick={this.toggleDim} />
    ) : (
      <></>
    );

    return (
      <div id="container">
        {dimScreen}
        <div id="leftSide">
          {this.state.currentUser.firstname === null && this.state.demoMode === false ? (
            <DefaultSidebar getDemoActivities={this.getDemoActivities} />
          ) : (
            <div>
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
                setActivityType={this.setActivityType}
                loadingActivities={this.state.loadingActivities}
                centerOnLocation={this.centerOnLocation}
                flashMessage={this.state.flashMessage}
                demoMode={this.state.demoMode}
                stravaLogout={this.stravaLogout}
              />
              <button onClick={this.test}>TEST</button>
            </div>
          )}
        </div>

        <div id="board">
          <div id="header">
            <div id="title">
              Mapper.Bike <span id="betatext">beta {`v-${version}`}</span>
            </div>{" "}
            <HeaderRight
              toggleShowMenu={this.toggleShowMenu}
              showMenu={this.state.showMenu}
              stravaLogout={this.stravaLogout}
              currentUser={this.state.currentUser}
            />
          </div>

          {/* TODO Add ability to center map on current location */}
          <Map
            id="mapcomp"
            containerStyle={this.state.mapStyles}
            google={this.props.google}
            zoom={11} //higher number = closer zoom
            mapTypeId="satellite"
            center={this.state.center}
            initialCenter={{
              lat: 33.945602,
              lng: -118.483297,
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

export default GoogleApiWrapper({
  apiKey: config.mapsApi,
  libraries: ["geometry", "visualization"],
})(App);
