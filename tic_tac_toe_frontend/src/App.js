import { useState, useMemo } from 'react';
import './App.css';

// PUBLIC_INTERFACE
function Square({ value, onClick, isWinner, disabled }) {
  return (
    <button 
      className={`square ${isWinner ? 'winner' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Square ${value || 'empty'}`}
      role="button"
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function ScoreBoard({ scores }) {
  return (
    <div className="score-board">
      <div className="score-item">
        <div className="score-label">X Wins</div>
        <div className="score-value">{scores.X}</div>
      </div>
      <div className="score-item">
        <div className="score-label">O Wins</div>
        <div className="score-value">{scores.O}</div>
      </div>
      <div className="score-item">
        <div className="score-label">Draws</div>
        <div className="score-value">{scores.D}</div>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, D: 0 });
  const [winningLine, setWinningLine] = useState(null);

  const gameResult = useMemo(() => calculateWinner(squares), [squares]);
  const isDraw = useMemo(() => 
    !gameResult && squares.every(square => square !== null),
    [squares, gameResult]
  );

  const handleClick = (i) => {
    if (gameResult || squares[i]) return;

    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);

    const result = calculateWinner(newSquares);
    if (result) {
      setWinningLine(result.line);
      setScores(prev => ({ ...prev, [result.winner]: prev[result.winner] + 1 }));
    } else if (newSquares.every(square => square !== null)) {
      setScores(prev => ({ ...prev, D: prev.D + 1 }));
    }
  };

  const resetBoard = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinningLine(null);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, D: 0 });
    resetBoard();
  };

  const status = gameResult
    ? `Winner: ${gameResult.winner}`
    : isDraw
    ? "Game is a draw!"
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="app">
      <div className="game-container">
        <ScoreBoard scores={scores} />
        <div className="status">{status}</div>
        <div className="board">
          {squares.map((value, i) => (
            <Square
              key={i}
              value={value}
              isWinner={winningLine?.includes(i)}
              onClick={() => handleClick(i)}
              disabled={gameResult || squares[i] !== null}
            />
          ))}
        </div>
        <div className="controls">
          <button 
            className="button button-primary" 
            onClick={resetBoard}
          >
            New Round
          </button>
          <button 
            className="button button-secondary" 
            onClick={resetScores}
          >
            Reset Scores
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
