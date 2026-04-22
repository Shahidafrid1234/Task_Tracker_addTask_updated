import { useEffect, useMemo, useState } from "react";
import { Button, ButtonGroup, Card } from "react-bootstrap";

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const getStrategicMove = (board, symbol, opponent) => {
  const emptyIndices = board
    .map((cell, index) => (cell ? -1 : index))
    .filter((index) => index !== -1);

  const findLineMove = (targetSymbol) => {
    for (const [a, b, c] of winningLines) {
      const line = [board[a], board[b], board[c]];
      const targetCount = line.filter((item) => item === targetSymbol).length;
      const emptyCount = line.filter((item) => !item).length;
      if (targetCount === 2 && emptyCount === 1) {
        if (!board[a]) return a;
        if (!board[b]) return b;
        if (!board[c]) return c;
      }
    }
    return -1;
  };

  const winningMove = findLineMove(symbol);
  if (winningMove !== -1) return winningMove;

  const blockingMove = findLineMove(opponent);
  if (blockingMove !== -1) return blockingMove;

  if (emptyIndices.includes(4)) return 4;

  const corners = [0, 2, 6, 8].filter((index) => emptyIndices.includes(index));
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)] ?? -1;
};

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [isXTurn, setIsXTurn] = useState(true);
  const [mode, setMode] = useState("pvp");

  const winner = useMemo(() => {
    for (const [a, b, c] of winningLines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return "";
  }, [board]);

  const isDraw = board.every(Boolean) && !winner;

  useEffect(() => {
    if (mode !== "cpu" || isXTurn || winner || isDraw) return;

    const timeoutId = setTimeout(() => {
      setBoard((prevBoard) => {
        const move = getStrategicMove(prevBoard, "O", "X");
        if (move === -1 || prevBoard[move]) return prevBoard;

        const nextBoard = [...prevBoard];
        nextBoard[move] = "O";
        return nextBoard;
      });
      setIsXTurn(true);
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [isDraw, isXTurn, mode, winner]);

  const handleCellClick = (index) => {
    if (board[index] || winner || (mode === "cpu" && !isXTurn)) return;

    const nextBoard = [...board];
    nextBoard[index] = isXTurn ? "X" : "O";
    setBoard(nextBoard);
    setIsXTurn((prev) => !prev);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(""));
    setIsXTurn(true);
  };

  const statusText = winner
    ? mode === "cpu"
      ? `Winner: ${winner === "X" ? "You" : "Computer"}`
      : `Winner: ${winner}`
    : isDraw
      ? "It is a draw."
      : mode === "cpu"
        ? `Turn: ${isXTurn ? "You (X)" : "Computer (O)"}`
        : `Turn: ${isXTurn ? "X" : "O"}`;

  return (
    <Card className="section-card h-100">
      <Card.Body>
        <Card.Title>Tic Tac Toe</Card.Title>
        <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap mb-2">
          <p className="small text-muted mb-0">{statusText}</p>
          <ButtonGroup size="sm" aria-label="Tic Tac Toe mode selector">
            <Button
              variant={mode === "pvp" ? "primary" : "outline-primary"}
              onClick={() => {
                setMode("pvp");
                resetGame();
              }}
            >
              2 Players
            </Button>
            <Button
              variant={mode === "cpu" ? "primary" : "outline-primary"}
              onClick={() => {
                setMode("cpu");
                resetGame();
              }}
            >
              Vs Computer
            </Button>
          </ButtonGroup>
        </div>
        <div className="ttt-grid mb-3">
          {board.map((cell, index) => (
            <button
              key={index}
              type="button"
              className="ttt-cell"
              onClick={() => handleCellClick(index)}
            >
              {cell}
            </button>
          ))}
        </div>
        <Button variant="outline-primary" onClick={resetGame}>
          Restart Game
        </Button>
      </Card.Body>
    </Card>
  );
}

export default TicTacToe;
