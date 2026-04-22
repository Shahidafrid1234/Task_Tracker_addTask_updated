import { Badge, Card } from "react-bootstrap";

function GamePlaceholder({ title }) {
  return (
    <Card className="section-card h-100 placeholder-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <Card.Title className="mb-0">{title}</Card.Title>
          <Badge bg="warning" text="dark">
            Under Construction
          </Badge>
        </div>

        <Card.Text className="fw-semibold placeholder-title mb-2">
          Under Construction
        </Card.Text>
        <Card.Text className="text-muted small mb-0">
          This mini game is coming soon.
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default GamePlaceholder;
