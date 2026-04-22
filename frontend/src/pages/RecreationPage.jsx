import { Col, Row } from "react-bootstrap";
import TicTacToe from "../components/TicTacToe";
import RockPaperScissors from "../components/RockPaperScissors";
import GamePlaceholder from "../components/GamePlaceholder";
import RecreationConstellation from "../components/RecreationConstellation";

function RecreationPage() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="page-title">Recreation Zone</h1>
        <p className="page-subtitle">
          Take a break with mini games while keeping your productivity up.
        </p>
      </div>

      <Row className="g-4">
        <Col lg={6}>
          <TicTacToe />
        </Col>
        <Col lg={6}>
          <RockPaperScissors />
        </Col>
        <Col lg={12}>
          <RecreationConstellation />
        </Col>
        <Col md={6} lg={4}>
          <GamePlaceholder title="Memory Match" />
        </Col>
        <Col md={6} lg={4}>
          <GamePlaceholder title="Speed Typing" />
        </Col>
        <Col md={6} lg={4}>
          <GamePlaceholder title="2048 Clone" />
        </Col>
      </Row>
    </div>
  );
}

export default RecreationPage;
