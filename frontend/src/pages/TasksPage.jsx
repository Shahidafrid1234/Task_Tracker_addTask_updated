import { useState } from "react";
import { Badge, Col, Row } from "react-bootstrap";
import AddTask from "../components/AddTask";
import TaskList from "../components/TaskList";
import TaskDashboardStats from "../components/TaskDashboardStats";

function TasksPage() {
  const [refreshSignal, setRefreshSignal] = useState(0);

  return (
    <Row>
      <Col>
        <div className="tasks-hero mb-4">
          <div className="tasks-hero-content">
            <Badge bg="primary" className="tasks-hero-badge mb-2">
              Productivity Workspace
            </Badge>
            <h1 className="page-title">Task Management</h1>
            <p className="page-subtitle mb-0">
              Plan better, execute faster, and keep every deadline visible at a
              glance.
            </p>
          </div>
        </div>

        <TaskDashboardStats refreshSignal={refreshSignal} />

        <AddTask onTaskCreated={() => setRefreshSignal((prev) => prev + 1)} />
        <TaskList refreshSignal={refreshSignal} />
      </Col>
    </Row>
  );
}

export default TasksPage;
