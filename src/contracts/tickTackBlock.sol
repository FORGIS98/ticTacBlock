pragma solidity ^0.6.10; // Solidity version (latest - Jun 2020)
// SPDX-License-Identifier: TODO

contract tickTackBlock{
  string player;
  int squareId;

  event playerPlay(string indexed _player, int indexed _squareId);

  function play(string memory _player, int _squareId) public {
    emit playerPlay(_player, _squareId);
  }

}
