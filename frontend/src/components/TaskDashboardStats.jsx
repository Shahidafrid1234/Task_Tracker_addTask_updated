import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { Card, Col, Row } from "react-bootstrap";

const GET_TASK_STATS = gql`
  query {
    tasks {
      id
      priority
      completed
      dueDate
    }
  }
`;

function TaskDashboardStats({ refreshSignal = 0 }) {
  const { loading, data } = useQuery(GET_TASK_STATS, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
  });

  const tasks = data?.tasks || [];
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;
  const highPriority = tasks.filter((task) => task.priority === "High").length;

  const today = new Date();
  const nextSevenDays = new Date();
  nextSevenDays.setDate(today.getDate() + 7);

  const dueSoon = tasks.filter((task) => {
    if (!task.dueDate || task.completed) return false;
    const dueDate = new Date(task.dueDate);
    return dueDate >= today && dueDate <= nextSevenDays;
  }).length;

  const cards = [
    {
      label: "Total Tasks",
      value: total,
      tone: "total",
    },
    {
      label: "Pending",
      value: pending,
      tone: "pending",
    },
    {
      label: "Completed",
      value: completed,
      tone: "completed",
    },
    {
      label: "High Priority",
      value: highPriority,
      tone: "high",
    },
    {
      label: "Due In 7 Days",
      value: dueSoon,
      tone: "soon",
    },
  ];

  return (
    <Row className="g-3 mb-4" key={refreshSignal}>
      {cards.map((card) => (
        <Col key={card.label} xs={6} md={4} lg={2} className="flex-grow-1">
          <Card className={`task-stat-card tone-${card.tone}`}>
            <Card.Body>
              <p className="task-stat-label mb-1">{card.label}</p>
              <h3 className="task-stat-value mb-0">{loading ? "--" : card.value}</h3>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default TaskDashboardStats;
