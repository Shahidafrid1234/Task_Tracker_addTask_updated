import { Button, Container, Nav, Navbar, Spinner } from "react-bootstrap";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import TasksPage from "./pages/TasksPage";
import RecreationPage from "./pages/RecreationPage";
import AuthPage from "./pages/AuthPage";
import { useAuth } from "./context/AuthContext";
import "./App.css";

function App() {
  const { user, loading, logOut } = useAuth();

  if (loading) {
    return (
      <div className="app-loader">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="app-shell">
      {user && (
        <Navbar expand="lg" className="tracker-navbar" sticky="top">
          <Container>
            <Navbar.Brand>Task Tracker Hub</Navbar.Brand>
            <Navbar.Toggle aria-controls="main-nav" />
            <Navbar.Collapse id="main-nav">
              <Nav className="ms-auto gap-2 align-items-lg-center">
                <Nav.Link as={NavLink} to="/tasks">
                  Tasks
                </Nav.Link>
                <Nav.Link as={NavLink} to="/recreation">
                  Recreation Zone
                </Nav.Link>
                <span className="auth-email d-none d-lg-inline">{user.email}</span>
                <Button variant="outline-secondary" size="sm" onClick={logOut}>
                  Sign Out
                </Button>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}

      <Container className="py-4" key={user?.uid || "anonymous"}>
        <Routes>
          {!user ? (
            <>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<Navigate to="/auth" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/tasks" replace />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/recreation" element={<RecreationPage />} />
              <Route path="*" element={<Navigate to="/tasks" replace />} />
            </>
          )}
        </Routes>
      </Container>
    </div>
  );
}

export default App;
