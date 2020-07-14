import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// We add our super cool smart contract and the abi json file
import useTickTackBlock from "./contracts/tickTackBlock.sol";
import tickTackAbi from "./abis/tickTackBlock.json";
// We add web3 library to interact with the blockchain
import Web3 from 'web3';

const json = require('./abis/tickTackBlock.json');

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

  //// BLOCKCHAIN DATA AND INFO ////

  // This method is invoked just before mounting occurs, called before render()
  async UNSAFE_componentWillMount(){
    await this.loadWeb3Data() // This function will connect to the blockchain provider
    await this.loadLocalBlockchainData() // This will aloud as to check accounts, balances, transactions...all kind blockchain methods.
  }

  async loadWeb3Data(){
    // This will check if there is any ethereum wallet or something like MetaMask
    if(typeof window.ethereum !== 'undefined'){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable() // This will sait until user logs into metamask (or the wallet app installed in the browser)
    }
    else
      window.alert("Non-ethereum browser detected, try installing MetaMask ^_^")
  }

  async loadLocalBlockchainData(){
    const web3 = window.web3 // We connect to web3 
    const accounts = await web3.eth.getAccounts() // Get all the accounts in metamask
    this.setState({ account: accounts[0] })

    // We take the smart contract address
    const address = json["networks"]["5777"]["address"];
    // We instantiate the contract to be aible to interact with it from js
    const contract = new web3.eth.Contract(tickTackAbi.abi, address)

  }





  //// //// //// ////

  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,


      // Extras for the blockchain
      account: '',
      transactions: [],
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
