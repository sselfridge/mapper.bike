import React, { Component } from "react";
import { GoogleApiWrapper, Map, Polyline, Polygon } from "google-maps-react";
import Sidebar from "./Sidebar";
import DefaultSidebar from "./DefaultSidebar"
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
        width: "75%",
        height: "95%"
      },
      loadingActivites: false,
      activeMarker: {},
      selectedPlace: {},
      polyLineArray: [],
      currentLine: null,
      activities: [],
      clickedLines: [],
      afterDate: new Date(),
      beforeDate: new Date(),
      activityType: "Ride",
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
      zIndex: 90
    };

    this.notSelectedActivity = {
      color: "blue",
      selected: false,
      weight: this.state.defaultStrokeWeight,
      zIndex: 2
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
    this.centerOnZip = this.centerOnZip.bind(this);
    this.flashMessage = this.flashMessage.bind(this);
    this.stravaLogout = this.stravaLogout.bind(this);
    this.toggleDim = this.toggleDim.bind(this);
    this.toggleShowMenu = this.toggleShowMenu.bind(this);
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
    const id = line.tag;
    const rideEl = document.getElementById(`ride${id}`);
    rideEl.scrollIntoView({
      behavior: "auto",
      block: "center",
      inline: "center"
    });

    this.selectActivity(id);
  }

  toggleBlackground() {
    let blackground = this.state.blackgroundActive;
    blackground = !blackground;
    this.setState({ blackgroundActive: blackground });
  }

  highlightTitle(e, id, startLatLng) {
    this.selectActivity(id);
    const center = { lat: startLatLng[0], lng: startLatLng[1] };
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
      activityType = `type=${this.state.activityType}`;
    }
    const quereyString = `/api/getActivities?${beforeDate}&${afterDate}&${activityType}`;

    axios.get(quereyString).then(res => {
      this.setState({ activities: res.data, loadingActivites: false });
    });
  }

  getDemoActivities() {
    this.setState({ loadingActivites: true });
    axios.get("/api/getDemoData").then(res => {
      this.setState({
        activities: res.data,
        loadingActivites: false,
        demoMode: true
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
  setActivityType(e) {
    console.log(e.target.value);
    this.setState({ activityType: e.target.value });
  }
  centerOnZip(e) {
    if (e.key == "Enter") {
      if (!/^\d{5}/.test(e.target.value)) {
        this.flashMessage("5 Digit US zipcodes only");
        return;
      } //only query if zip is 5 numbers
      axios
        .get(`/api/getLatLngZip/${e.target.value}`)
        .then(res => {
          if (res.data) {
            this.setState({ center: res.data });
          }
        })
        .catch(err => {
          this.flashMessage("5 Digit US zipcodes only");
        });
    }
  }

  flashMessage(message, type) {
    const flashMessage = message;
    this.setState({ flashMessage });

    setTimeout(() => {
      this.setState({ flashMessage: "" });
    }, 5000);
  }

  stravaLogout() {
    axios.get("/api/logout").then(res => {
      if (res.status === 200) {
        const emptyUser = {
          avatar: null,
          firstname: null,
          lastname: null
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

  componentWillMount() {
    axios.get(`/api/getStravaUser`).then(res => {
      if (res.status === 200) {
        this.setState({ currentUser: res.data });
      }
    });
    const afterDate = new Date();
    afterDate.setMonth(afterDate.getMonth() - 2);
    this.setState({ afterDate });
  }

  render() {
    const activities = this.state.activities;
    const polyLineArray = [];

    console.log("Version:", VERSION);

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
          { lat: 89, lng: -179 }
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
          { lat: 89, lng: -180 }
        ]}
        key="blackground1"
        fillColor="black"
        fillOpacity={1}
        clickable={false}
        zIndex={-99}
        visible={this.state.blackgroundActive}
      />
    ];
    console.log(`App ENV:${process.env.NODE_ENV}`);
    console.log(`client: ${config.client_id}`);

    const dimScreen = this.state.dimScreen ? (
      <div id="dimScreen" onClick={this.toggleDim} />
    ) : (
      <></>
    );

    const hamburgerMenu = this.state.showMenu ? (
      <div id="menuModal">
        <a target="_blank" href="http://www.github.com/sselfridge/mapper.bike">
          View source on GitHub
        </a>
        <hr />
        <a href="mailto:Sam.Selfridge@gmail.com">Sam.Selfridge@gmail.com</a>
        <hr />
        <a href="" onClick={this.stravaLogout}>
          Logout
        </a>
      </div>
    ) : (
      <></>
    );

    return (
      <div id="container">
        {dimScreen}
        <div id="leftSide">
          {this.state.currentUser.firstname === null &&
          this.state.demoMode === false ? (
            < DefaultSidebar getDemoActivities={this.getDemoActivities} />
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
                setActivityType={this.setActivityType}
                loadingActivites={this.state.loadingActivites}
                centerOnZip={this.centerOnZip}
                flashMessage={this.state.flashMessage}
                demoMode={this.state.demoMode}
                stravaLogout={this.stravaLogout}
              />
            </div>
          )}
        </div>

        <div id="board">
          <div id="header">
            <div id="title">
              Mapper.Bike <span id="betatext">beta {`v-${VERSION}`}</span>
            </div>{" "}
            <div>
              {/* Feedback? Contact me at:
              <a href="mailto:sam.selfridge@gmail.com?subject=Mapper.Bike">
                Sam.Selfridge@gmail.com
              </a>
              <br />
              Source Code:
            */}
              <span onClick={this.toggleShowMenu} className="hamburger" />
              {hamburgerMenu}
            </div>
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

export default GoogleApiWrapper({
  apiKey: config.mapsApi,
  libraries: ["geometry", "visualization"]
})(App);
