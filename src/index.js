import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


//__ class Square extends React.Component {
//__ 
//__   //  Constructor for square (not needed because Square doesn't keep track of
//__   //  the game's state.)
//__ //  constructor(props){
//__ //    // super() is needes in js classes when defining the constructor
//__ //    super(props);
//__ //    // this.state will "remember" that we've clicked the square
//__ //    this.state = {
//__ //      value: null,
//__ //    }
//__ //  }
//__ 
//__   render() {
//__     return (
//__       <button 
//__       className="square" 
//__       onClick = {() => this.props.onClick({value: 'X'})}
//__       >
//__ 
//__       {this.props.value}
//__ 
//__       </button>
//__     );
//__   }
//__ }

// Function components are a simpler way to write components 
// that only contain a render method and don’t have their own state. 
function Square(props){
  return(
    <button className="square" onClick={props.onClick}>
    {props.value}
    </button>
  );
}

class Board extends React.Component {

  constructor(props){
    super(props);
    // This will save the state of the game
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  handleClick(i){
    // with .slice() we create a copy of the original array so we don't
    // change the real array directly (immutability is important)
    const squares = this.state.squares.slice();
    squares[i] = 'X'
    this.setState({squares: squares});
  }

  renderSquare(i) {
    return (
      <Square 
      value = {this.state.squares[i]}
      onClick = {() => this.handleClick(i)}
      />
    );
  }

  // Returns a description of what you want to see on the screen.
  render() {
    const status = 'Next player: X';

    return (

      // <div>
      //   <div className="status">{status}</div>
      //   <div className="board-row">
      //     {this.renderSquare(0)}
      //     {this.renderSquare(1)}
      //     {this.renderSquare(2)}
      //   </div>
      //   <div className="board-row">
      //     {this.renderSquare(3)}
      //     {this.renderSquare(4)}
      //     {this.renderSquare(5)}
      //   </div>
      //   <div className="board-row">
      //     {this.renderSquare(6)}
      //     {this.renderSquare(7)}
      //     {this.renderSquare(8)}
      //   </div>
      // </div>

      // Another way (maybe more pro) of doing the return is by using
      // JSX syntax like so:

      React.createElement("div", null, React.createElement("div", {
        className: "status"
      }, status), React.createElement("div", {
        className: "board-row"
      }, this.renderSquare(0), this.renderSquare(1), this.renderSquare(2)), React.createElement("div", {
        className: "board-row"
      }, this.renderSquare(3), this.renderSquare(4), this.renderSquare(5)), React.createElement("div", {
        className: "board-row"
      }, this.renderSquare(6), this.renderSquare(7), this.renderSquare(8)))
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
      <div className="game-board">
      <Board />
      </div>
      <div className="game-info">
      <div>{/* status */}</div>
      <ol>{/* TODO */}</ol>
      </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

