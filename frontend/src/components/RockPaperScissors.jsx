import { useState } from "react";
import { Badge, Button, Card } from "react-bootstrap";

const options = ["Rock", "Paper", "Scissors"];

function decideWinner(player, computer) {
  if (player === computer) return "Draw";
  if (
    (player === "Rock" && computer === "Scissors") ||
    (player === "Paper" && computer === "Rock") ||
    (player === "Scissors" && computer === "Paper")
  ) {
    return "You Win";
  }
  return "Computer Wins";
}

function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState("");
  const [computerChoice, setComputerChoice] = useState("");
  const [result, setResult] = useState("Choose your move to start the game.");
  const [score, setScore] = useState({ player: 0, computer: 0, draws: 0 });

  const playTone = (frequency, duration = 0.09) => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;
    gain.gain.value = 0.04;

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  };

  const playResultSound = (roundResult) => {
    if (roundResult === "You Win") {
      playTone(660, 0.1);
      setTimeout(() => playTone(880, 0.12), 90);
      return;
    }

    if (roundResult === "Computer Wins") {
      playTone(220, 0.16);
      return;
    }

    playTone(420, 0.12);
  };

  const playRound = (choice) => {
    const randomChoice = options[Math.floor(Math.random() * options.length)];
    const roundResult = decideWinner(choice, randomChoice);

    setPlayerChoice(choice);
    setComputerChoice(randomChoice);
    setResult(roundResult);

    setScore((prev) => ({
      player: prev.player + (roundResult === "You Win" ? 1 : 0),
      computer: prev.computer + (roundResult === "Computer Wins" ? 1 : 0),
      draws: prev.draws + (roundResult === "Draw" ? 1 : 0),
    }));

    playResultSound(roundResult);
  };

  const resetScore = () => {
    setScore({ player: 0, computer: 0, draws: 0 });
    setPlayerChoice("");
    setComputerChoice("");
    setResult("Choose your move to start the game.");
  };

  return (
    <Card className="section-card h-100">
      <Card.Body>
        <Card.Title>Rock Paper Scissors</Card.Title>
        <p className="small text-muted mb-3">Play against the computer.</p>

        <div className="d-flex flex-wrap gap-2 mb-3">
          <Badge bg="primary" className="score-badge">
            You: {score.player}
          </Badge>
          <Badge bg="danger" className="score-badge">
            Computer: {score.computer}
          </Badge>
          <Badge bg="secondary" className="score-badge">
            Draws: {score.draws}
          </Badge>
        </div>

        <div className="d-flex flex-wrap gap-2 mb-3">
          {options.map((option) => (
            <Button
              key={option}
              variant="outline-dark"
              onClick={() => playRound(option)}
            >
              {option}
            </Button>
          ))}
        </div>
        <p className="mb-1">Your Choice: {playerChoice || "-"}</p>
        <p className="mb-1">Computer Choice: {computerChoice || "-"}</p>
        <p className="fw-semibold mb-3">Result: {result}</p>

        <Button size="sm" variant="outline-secondary" onClick={resetScore}>
          Reset Match
        </Button>
      </Card.Body>
    </Card>
  );
}

export default RockPaperScissors;
