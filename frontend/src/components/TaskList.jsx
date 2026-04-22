import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Form,
  Modal,
  Pagination,
  Table,
} from "react-bootstrap";

const GET_TASKS = gql`
  query {
    tasks {
      id
      title
      description
      dueDate
      priority
      completed
    }
  }
`;

const UPDATE_TASK = gql`
  mutation (
    $id: ID!
    $title: String!
    $description: String
    $dueDate: String
    $priority: String
  ) {
    updateTask(
      id: $id
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
    }
  }
`;

const DELETE_TASK = gql`
  mutation ($id: ID!) {
    deleteTask(id: $id)
  }
`;

const TOGGLE_TASK = gql`
  mutation ($id: ID!) {
    toggleTask(id: $id) {
      id
      completed
    }
  }
`;

function TaskList({ refreshSignal = 0 }) {
  const { loading, error, data, refetch } = useQuery(GET_TASKS, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
  });
  const [updateTask] = useMutation(UPDATE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);
  const [toggleTask] = useMutation(TOGGLE_TASK);

  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editPriority, setEditPriority] = useState("Medium");
  const tasksPerPage = 5;

  useEffect(() => {
    refetch();
  }, [refreshSignal, refetch]);

  const tasks = data?.tasks || [];
  const totalPages = Math.max(1, Math.ceil(tasks.length / tasksPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const currentTasks = useMemo(() => {
    const start = (currentPage - 1) * tasksPerPage;
    return tasks.slice(start, start + tasksPerPage);
  }, [currentPage, tasks]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const priorityVariant = (priority) => {
    if (priority === "High") return "danger";
    if (priority === "Low") return "success";
    return "warning";
  };

  const toDateInputValue = (dateValue) => {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  const handleSaveUpdate = async (id) => {
    await updateTask({
      variables: {
        id,
        title: editTitle,
        description: editDesc,
        dueDate: editDueDate || null,
        priority: editPriority,
      },
    });
    setEditingId("");
    showMessage("Task updated successfully!");
    refetch();
  };

  const handleDelete = async (id) => {
    const { data: deleteData } = await deleteTask({ variables: { id } });
    showMessage(deleteData.deleteTask);
    refetch();
  };

  const handleToggle = async (id) => {
    await toggleTask({ variables: { id } });
    refetch();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading tasks: {error.message}</p>;

  return (
    <Card className="section-card">
      <Card.Body>
        {message && <Alert variant="success">{message}</Alert>}

        <Card.Title className="mb-3">All Tasks</Card.Title>
        <div className="table-responsive">
          <Table striped hover bordered>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description || "-"}</td>
                  <td>
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <Badge bg={priorityVariant(task.priority)}>{task.priority}</Badge>
                  </td>
                  <td>
                    <Badge bg={task.completed ? "secondary" : "primary"}>
                      {task.completed ? "Completed" : "Pending"}
                    </Badge>
                  </td>
                  <td className="d-flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline-success"
                      onClick={() => handleToggle(task.id)}
                    >
                      Toggle
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => {
                        setEditingId(task.id);
                        setEditTitle(task.title);
                        setEditDesc(task.description || "");
                        setEditDueDate(toDateInputValue(task.dueDate));
                        setEditPriority(task.priority || "Medium");
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(task.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              {currentTasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No tasks available.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <Pagination className="mt-3 mb-0">
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          />
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
            <Pagination.Item
              key={page}
              active={page === currentPage}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          />
        </Pagination>

        <Modal show={Boolean(editingId)} onHide={() => setEditingId("")} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="editTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="editDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="editDueDate">
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="editPriority">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditingId("")}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => handleSaveUpdate(editingId)}
              disabled={!editTitle.trim()}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
  );
}

export default TaskList;
