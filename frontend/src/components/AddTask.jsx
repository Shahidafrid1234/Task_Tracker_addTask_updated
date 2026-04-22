import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { Button, Card, Col, Form, Row } from "react-bootstrap";

const ADD_TASK = gql`
  mutation (
    $title: String!
    $description: String
    $dueDate: String
    $priority: String
  ) {
    addTask(
      title: $title
      description: $description
      dueDate: $dueDate
      priority: $priority
    ) {
      id
      title
      description
      dueDate
      priority
      completed
    }
  }
`;

function AddTask({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");

  const [addTask] = useMutation(ADD_TASK);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addTask({
      variables: {
        title,
        description,
        dueDate: dueDate || null,
        priority,
      },
    });

    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("Medium");
    if (onTaskCreated) onTaskCreated();
  };

  return (
    <Card className="section-card mb-4">
      <Card.Body>
        <Card.Title>Add New Task</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="taskTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="taskDueDate">
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group controlId="taskDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add task details"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="taskPriority">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-3">
            <Button type="submit" variant="primary">
              Create Task
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
export default AddTask;
