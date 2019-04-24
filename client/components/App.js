import React, { Component } from 'react';
import { GoogleApiWrapper,Map } from 'google-maps-react'
// import Map from "./Map"
import { MapContainer } from './MapContainer';

//functions go here



 class App extends Component {
  // constructor(props) {
  //   super(props);
  //   // this.handleClick = this.handleClick.bind(this);
  //   this.state = {
  //     userToken : null,
  //     googleAPI: 'AIzaSyBrNOaBlCJF1AI8Tb52mc26Bl3Cbda560o',
  //     blackgroundActive : false,
  //     google: null
  //   }
  // }

  // All functions will execute here
  // handleClick(row, square) {
  //   let { turn, winner } = this.state;
  //   const { rows } = this.state;
  //   const squareInQuestion = rows[row][square];

  //   if (this.state.winner) return;
  //   if (squareInQuestion) return;

  //   rows[row][square] = turn;
  //   turn = turn === 'X' ? 'O' : 'X';
  //   winner = checkWin(rows);

  //   this.setState({
  //     rows,
  //     turn,
  //     winner,
  //   });
  // }

  render() {
    // const { rows, turn, winner, gameList } = this.state;
    // const handleClick = this.handleClick;

    // const rowElements = rows.map((letters, i) => (
    //   <Row key={i} row={i} letters={letters} handleClick={handleClick} />
    // ));

    const mapStyles = {
      width: '800px',
      height: '600px',
      position: 'static'
    }

    if (!this.props.loaded) {
      return (
        <div id='board'>Map Loading...maybe</div>
      );
    } else {
      return (
        <div id="container">
        <h1>This is mein map</h1>
        <div id="board">
          <Map 
          style={mapStyles}
          google={this.props.google}
             />
        </div>
        </div>
      );
    }
  }
}
export default GoogleApiWrapper({
  apiKey: 'AIzaSyBrNOaBlCJF1AI8Tb52mc26Bl3Cbda560o'
})(App);
