import React, { useState } from "react";
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Mail, Lock, User } from "lucide-react";
import NavbarCustom from "../Components/Navbar";
import "./AuthPage.css";

function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Состояния для полей
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Вход через Google/Facebook
  const handleSocialLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: { redirectTo: window.location.origin + "/profile" }
    });
    if (error) setError(error.message);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { email, password, confirmPassword, firstName, lastName } = formData;

    if (isRegister) {
      // Валидация регистрации
      if (password !== confirmPassword) {
        setError("Пароли не совпадают");
        setLoading(false);
        return;
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`,
            first_name: firstName,
          }
        }
      });

      if (signUpError) setError(signUpError.message);
      else navigate("/profile");
    } else {
      // Логика входа
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (signInError) setError(signInError.message);
      else navigate("/profile");
    }
    setLoading(false);
  };

  return (
    <div className="auth-page-wrapper">
      <NavbarCustom />
      <Container className="auth-page-form-container d-flex align-items-center justify-content-center py-5">
        <Card className="auth-card shadow-lg border-0">
          <Card.Body className="p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="auth-icon-circle mb-3">
                {isRegister ? <UserPlus size={32} /> : <LogIn size={32} />}
              </div>
              <h2 className="fw-bold">{isRegister ? "Регистрация" : "Вход в аккаунт"}</h2>
            </div>

            {error && <Alert variant="danger" className="small">{error}</Alert>}

            <Form onSubmit={handleAuth}>
              {isRegister && (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold">Имя</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text"><User size={16} /></span>
                        <Form.Control name="firstName" placeholder="Иван" onChange={handleChange} required />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold">Фамилия</Form.Label>
                      <Form.Control name="lastName" placeholder="Иванов" onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                </Row>
              )}

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Email</Form.Label>
                <div className="input-group">
                  <span className="input-group-text"><Mail size={16} /></span>
                  <Form.Control name="email" type="email" placeholder="example@mail.com" onChange={handleChange} required />
                </div>
              </Form.Group>

              <Row>
                <Col md={isRegister ? 6 : 12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Пароль</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text"><Lock size={16} /></span>
                      <Form.Control name="password" type="password" placeholder="••••••••" onChange={handleChange} required />
                    </div>
                  </Form.Group>
                </Col>
                {isRegister && (
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold">Повторите пароль</Form.Label>
                      <Form.Control name="confirmPassword" type="password" placeholder="••••••••" onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                )}
              </Row>

              <Button variant="success" type="submit" className="w-100 py-2 mb-3 mt-2 btn-auth" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : (isRegister ? "Создать аккаунт" : "Войти")}
              </Button>
            </Form>

            <div className="divider text-muted mb-3"><span>или войти через</span></div>

            <Row className="g-2 mb-4">
              <Col>
                <Button variant="outline-dark" className="w-100 d-flex align-items-center justify-content-center gap-2 social-btn" onClick={() => handleSocialLogin('google')}>
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="Google" /> Google
                </Button>
              </Col>
            </Row>

            <div className="text-center">
              <button className="btn btn-link text-success text-decoration-none fw-bold" onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
              </button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default AuthPage;