import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

const mapStyles = {
  width: '100%',
  height: '100%'
};

export class MapContainer extends Component {
  render() {
    return (
      <Map
        google={this.props.google}
        zoom={14}
        style={mapStyles}
        initialCenter={{
         lat: -1.2884,
         lng: 36.8233
        }}
      />
    );
  }
}

const LoadingCointainer = (props) => (
    <div>Fancy Loading Stuff</div>
)

export default GoogleApiWrapper({
//   apiKey: 'AIzaSyBrNOaBlCJF1AI8Tb52mc26Bl3Cbda560o'
  apiKey: 'AIzaSyBrNOaBlCJFasdfwer1AI8Tb52mc26Bl3Cbda560o'
})(MapContainer);