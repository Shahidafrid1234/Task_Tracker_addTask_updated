import { useState } from "react";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (isSignUpMode && password !== confirmPassword) {
      setErrorMessage("Password and Confirm Password do not match.");
      return;
    }

    setSubmitting(true);

    try {
      if (isSignUpMode) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (error) {
      setErrorMessage(error.message || "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Row className="justify-content-center py-4 auth-page-row">
      <Col md={8} lg={5}>
        <Card className="section-card auth-card auth-card-static">
          <Card.Body className="auth-form-wrap">
            <h3 className="mb-2">{isSignUpMode ? "Create Account" : "Welcome Back"}</h3>
            <p className="text-muted mb-4">
              {isSignUpMode
                ? "Sign up with email and password to access your workspace."
                : "Sign in to continue managing your tasks."}
            </p>

            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="authEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="authPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={6}
                  required
                />
              </Form.Group>

              {isSignUpMode && (
                <Form.Group className="mb-3" controlId="authConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    minLength={6}
                    required
                  />
                </Form.Group>
              )}

              <Form.Text muted>Password must be at least 6 characters.</Form.Text>

              <Button type="submit" className="w-100 auth-submit mt-3" disabled={submitting}>
                {submitting
                  ? "Please wait..."
                  : isSignUpMode
                    ? "Create My Account"
                    : "Sign In"}
              </Button>
            </Form>

            <div className="mt-3 text-center">
              <Button
                variant="link"
                className="p-0 auth-switch"
                onClick={() => {
                  setIsSignUpMode((prev) => !prev);
                  setErrorMessage("");
                  setConfirmPassword("");
                }}
              >
                {isSignUpMode
                  ? "Already have an account? Sign In"
                  : "Need an account? Sign Up"}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default AuthPage;
