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

  // Commented for Adding Time Travel
  // constructor(props){
  //   super(props);
  //   // This will save the state of the game
  //   this.state = {
  //     squares: Array(9).fill(null),
  //     xIsNext: true,
  //   };
  // }

  renderSquare(i) {
    return (
      <Square 
      value = {this.props.squares[i]}
      onClick = {() => this.props.onClick(i)}
      />
    );
  }

  // Returns a description of what you want to see on the screen.
  render() {
   return (

      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>

      // Another way (maybe more pro) of doing the return is by using
      // JSX syntax like so:

      // React.createElement("div", null, React.createElement("div", {
      //   className: "status"
      // }, status), React.createElement("div", {
      //   className: "board-row"
      // }, this.renderSquare(0), this.renderSquare(1), this.renderSquare(2)), React.createElement("div", {
      //   className: "board-row"
      // }, this.renderSquare(3), this.renderSquare(4), this.renderSquare(5)), React.createElement("div", {
      //   className: "board-row"
      // }, this.renderSquare(6), this.renderSquare(7), this.renderSquare(8)))
    );
  }
}

class Game extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  handleClick(i){
    // with .slice() we create a copy of the original array so we don't
    // change the real array directly (immutability is important)

    // With next 2 lines we ensure that if we go back in time and make a new move
    // from that point, we throw away all the future history that now is incorrect
    // is like a "restart"
    const history = this.state.history.slice(
      0, this.state.stepNumber + 1
    );
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    // If there is a winner or a square is already fill we just return
    // So a player can't change a value already in the game
    if(calculateWinner(squares) || squares[i])
      return;
    
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move : 'Go to game start';
      return(
        <li key = {move}>
          <button onClick = {() => this.jumpTo(move)} > {desc} ></button>
        </li>
      );
    });

    let status;
    if(winner)
      status = 'Winner: ' + winner;
    else
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');


    return (
      <div className="game">
      <div className="game-board">
      <Board 
      squares = {current.squares}
      onClick = {(i) => this.handleClick(i)}
      />
      </div>
      <div className="game-info">
      <div>{status}</div>
      <ol>{moves}</ol>
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

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
