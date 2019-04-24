import React, { Component } from 'react';

import { MapContainer } from './MapContainer';

//functions go here



class App extends Component {
  constructor(props) {
    super(props);
    // this.handleClick = this.handleClick.bind(this);
    this.state = {
      userToken : null,
      googleAPI: 'AIzaSyBrNOaBlCJF1AI8Tb52mc26Bl3Cbda560o',
      blackgroundActive : false,
    }
  }
  
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

  
    return (
      <div>
        
        <div id="board">
          <MapContainer />
        </div>
      </div>
    );
  }
}

export default App;
