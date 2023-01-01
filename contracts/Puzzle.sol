// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Puzzle {
    struct puzzle {
        bytes32 clue;
        bytes32 answer;
        bool solved;
    }

    mapping(uint256 => puzzle) public puzzles;

    uint256 public puzzleCounter;

    event newPuzzle(address creator, uint256 index);
    event solved(address solver, uint256 index);

    function createPuzzle(bytes32 clue, bytes32 answer) public {
        puzzles[puzzleCounter] = puzzle(clue, answer, false);
        emit newPuzzle(msg.sender, puzzleCounter);

        puzzleCounter++;
    }

    function solvePuzzle(
        uint256 index,
        string calldata guess
    ) public returns (string memory) {
        puzzle storage _puzzle = puzzles[index];

        require(_puzzle.solved != true, "ALREADY_SOLVED");

        if (_puzzle.answer == keccak256(abi.encodePacked(guess))) {
            _puzzle.solved = true;
            emit solved(msg.sender, index);
            return "RIGHT_ANSWER";
        } else {
            return "WRONG_ANSWER";
        }
    }
}
