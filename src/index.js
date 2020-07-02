import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class Square extends React.Component {

  constructor(props){
    // super() is needes in js classes when defining the constructor
    super(props);
    // this.state will "remember" that we've clicked the square
    this.state = {
      value: null,
    }
  }

  render() {
    return (
      <button 
      className="square" 
      onClick = {() => this.setState({value: 'X'})}
      >

      {this.state.value}

      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square value = {i}/>;
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

