import { useState } from "react";
import GameBoard from "./components/GameBoard";
import Player from "./components/Player";
import Log from "./components/Log";
import { WINNING_COMBINATIONS } from "./winning-combinations";
import GameOver from "./components/GameOver";

const PLAYERS = {
  X: "Player 1",
  O: "Player 2",
};

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

// Derive as much state as possible in react components
// instead of storing more state than necessary
function deriveActivePlayer(gameTurns) {
  let currentPlayer = "X";

  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currentPlayer = "O";
  }

  return currentPlayer;
}

function App() {
  const [gameTurns, setGameTurns] = useState([]);
  const [playerNames, setPlayerNames] = useState(PLAYERS);

  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, playerNames);
  const hasDraw = gameTurns.length === 9 && !winner;

  function deriveGameBoard(gameTurns) {
    // Overlooked bug, this needs to be a deep copy
    // before it was assigned by reference to INITIAL_GAME_BOARD
    // and was mutating the INITIAL_GAME_BOARD
    let gameBoard = [...INITIAL_GAME_BOARD.map((arrayRow) => [...arrayRow])];

    // derived state from turns into gameBoard
    for (const turn of gameTurns) {
      const { square, player } = turn;
      const { row, col } = square;

      gameBoard[row][col] = player;
    }
    return gameBoard;
  }

  function deriveWinner(gameBoard, playerNames) {
    let winner = null;

    for (const combination of WINNING_COMBINATIONS) {
      const firstSquareSymbol =
        gameBoard[combination[0].row][combination[0].column];
      const secondSquareSymbol =
        gameBoard[combination[1].row][combination[1].column];
      const thirdSquareSymbol =
        gameBoard[combination[2].row][combination[2].column];

      if (
        firstSquareSymbol &&
        firstSquareSymbol === secondSquareSymbol &&
        firstSquareSymbol === thirdSquareSymbol
      ) {
        winner = playerNames[firstSquareSymbol];
      }
    }
    return winner;
  }

  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);

      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];

      return updatedTurns;
    });
  }

  function handleRestart() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayerNames((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName,
      };
    });
  }

  return (
    <main>
      <div id="game-container">
        <ol className="highlight-player" id="players">
          <Player
            initialName={PLAYERS.X}
            symbol="X"
            isActive={activePlayer === "X" ? true : false}
            onChangeName={handlePlayerNameChange}
          />
          <Player
            initialName={PLAYERS.O}
            symbol="O"
            isActive={activePlayer === "O" ? true : false}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver onRestart={handleRestart} winner={winner} />
        )}
        <GameBoard board={gameBoard} onSelectSquare={handleSelectSquare} />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
