import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Mail, Lock, User } from "lucide-react";
import { useTranslation } from "react-i18next"; // Добавили перевод
import NavbarCustom from "../Components/Navbar";
import "./AuthPage.css";

function AuthPage() {
  const { t } = useTranslation();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: ""
  });

  // Очищаем ошибку при переключении входа/регистрации
  useEffect(() => {
    setError(null);
  }, [isRegister]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      if (password !== confirmPassword) {
        setError(t("auth_page.error_password_match"));
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
              <h2 className="fw-bold">
                {isRegister ? t("auth_page.register_title") : t("auth_page.login_title")}
              </h2>
            </div>

            {error && <Alert variant="danger" className="small">{error}</Alert>}

            <Form onSubmit={handleAuth}>
              {isRegister && (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold">{t("auth_page.label_first_name")}</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text"><User size={16} /></span>
                        <Form.Control name="firstName" placeholder={t("auth_page.placeholder_first_name")} onChange={handleChange} required />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold">{t("auth_page.label_last_name")}</Form.Label>
                      <Form.Control name="lastName" placeholder={t("auth_page.placeholder_last_name")} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                </Row>
              )}

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">{t("auth_page.label_email")}</Form.Label>
                <div className="input-group">
                  <span className="input-group-text"><Mail size={16} /></span>
                  <Form.Control name="email" type="email" placeholder="example@mail.com" onChange={handleChange} required />
                </div>
              </Form.Group>

              <Row>
                <Col md={isRegister ? 6 : 12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">{t("auth_page.label_password")}</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text"><Lock size={16} /></span>
                      <Form.Control name="password" type="password" placeholder="••••••••" onChange={handleChange} required />
                    </div>
                  </Form.Group>
                </Col>
                {isRegister && (
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold">{t("auth_page.label_confirm_password")}</Form.Label>
                      <Form.Control name="confirmPassword" type="password" placeholder="••••••••" onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                )}
              </Row>

              <Button variant="success" type="submit" className="w-100 py-2 mb-3 mt-2 btn-auth" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : (isRegister ? t("auth_page.btn_create_account") : t("auth_page.btn_login"))}
              </Button>
            </Form>

            <div className="divider text-muted mb-3"><span>{t("auth_page.or_social")}</span></div>

            <Row className="g-2 mb-4">
              <Col>
                <Button variant="outline-dark" className="w-100 d-flex align-items-center justify-content-center gap-2 social-btn" onClick={() => handleSocialLogin('google')}>
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="Google" /> Google
                </Button>
              </Col>
            </Row>

            <div className="text-center">
              <button className="btn btn-link text-success text-decoration-none fw-bold" onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? t("auth_page.switch_to_login") : t("auth_page.switch_to_register")}
              </button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default AuthPage;