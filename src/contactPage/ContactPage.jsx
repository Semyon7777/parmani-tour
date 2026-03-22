import React, { useState, useEffect, useRef } from "react";
import Footer from "../Components/Footer";
import { Container, Row, Col, Card, Accordion, Form, Button, Spinner, Alert, Modal } from "react-bootstrap";
import { FaWhatsapp, FaTelegramPlane, FaInstagram, FaMapMarkerAlt, FaClock, FaPhoneAlt } from 'react-icons/fa';
import NavbarCustom from "../Components/Navbar";
import { useTranslation } from "react-i18next";
import emailjs from '@emailjs/browser';
import ReCAPTCHA from "react-google-recaptcha";
import "./ContactPage.css";

function ContactPage() {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="tour-contact-page-root">
      <NavbarCustom />
    
      {/* Hero Section */}
      <div className="tour-hero-header">
        <Container>
          <h1 className="tour-main-title">{t("contact_page.title")}</h1>
          <p className="tour-main-subtitle mx-auto">
            {t("contact_page.description")}
          </p>
        </Container>
      </div>

      <Container className="my-5">
        <Row className="g-4">
          {/* Левая колонка: Ваша форма */}
          <Col lg={8}>
            <div className="tour-form-container shadow-sm">
              <ContactWithUs />
            </div>
          </Col>

          {/* Правая колонка: Социальные сети и инфо */}
          <Col lg={4}>
            <div className="d-flex flex-column gap-4 messenger-block-container"> 
              
              {/* Блок Мессенджеров */}
              <Card className="border-0 shadow-sm tour-side-card">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-3 tour-text-green">Свяжитесь с нами</h5>
                  <div className="d-grid gap-3">
                    <a href="https://wa.me/your_number" target="_blank" rel="noreferrer" className="tour-social-btn tour-btn-wa">
                      <FaWhatsapp className="me-2" /> WhatsApp
                    </a>
                    <a href="https://t.me/your_username" target="_blank" rel="noreferrer" className="tour-social-btn tour-btn-tg">
                      <FaTelegramPlane className="me-2" /> Telegram
                    </a>
                    <a href="https://instagram.com/your_profile" target="_blank" rel="noreferrer" className="tour-social-btn tour-btn-ig">
                      <FaInstagram className="me-2" /> Instagram Direct
                    </a>
                  </div>
                </Card.Body>
              </Card>

              {/* Блок Контактов */}
              <Card className="border-0 shadow-sm tour-side-card tour-bg-mint">
                <Card.Body className="p-4">
                  <div className="d-flex mb-3 align-items-start">
                    <div className="tour-icon-circle me-3"><FaMapMarkerAlt /></div>
                    <div>
                      <h6 className="fw-bold mb-0">Офис</h6>
                      <small className="text-muted">ул. Зеленая, дом 42, Алматы</small>
                    </div>
                  </div>
                  <div className="d-flex mb-3 align-items-start">
                    <div className="tour-icon-circle me-3"><FaPhoneAlt /></div>
                    <div>
                      <h6 className="fw-bold mb-0">Телефон</h6>
                      <small className="text-muted">+7 (700) 000-00-00</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-start">
                    <div className="tour-icon-circle me-3"><FaClock /></div>
                    <div>
                      <h6 className="fw-bold mb-0">Часы работы</h6>
                      <small className="text-muted">Пн-Пт: 10:00 — 19:00</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>

            </div>
          </Col>
        </Row>
      </Container>

      {/* FAQ Блок */}
      <ContactFAQ />

      <Footer />
    </div>
  );
}

function ContactWithUs() {
const { t } = useTranslation();
  // 1. Создаем реф для капчи
  const recaptchaRef = useRef(); 

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 2. Делаем функцию асинхронной (async)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидация
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage(t("contact_page.error_fill_all"));
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrorMessage(t("contact_page.error_email"));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // 3. Запускаем проверку капчи и ждем токен
      const token = await recaptchaRef.current.executeAsync();

      if (!token) {
        setErrorMessage("Captcha verification failed.");
        setIsSubmitting(false);
        return;
      }

      // --- НАСТРОЙКИ EMAILJS ---
      const serviceID = "service_fkaou6c";   
      const templateID = "template_taw2p8j"; 
      const publicKey = "IUMzWx8Tsm9hYF3UR";   

      // 4. Добавляем токен в параметры
      const templateParams = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        subject: "New Message from Website",
        'g-recaptcha-response': token // Это поле нужно EmailJS для проверки капчи
      };

      // Инициализация и отправка
      emailjs.init(publicKey); 
      
      const response = await emailjs.send(serviceID, templateID, templateParams, publicKey);
      
      console.log('SUCCESS!', response.status, response.text);
      setShowAlert(true);
      setFormData({ name: "", email: "", message: "" });
      
      // 5. Сбрасываем капчу после успеха
      recaptchaRef.current.reset();

    } catch (err) {
      console.error('FAILED...', err);
      console.log("Error details:", err.text); 
      setErrorMessage(t("contact_page.error_send") + " (" + (err.text || "Check console") + ")");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.2 }
    );
    document.querySelectorAll(".contactContent, .contactInfoBlock").forEach((el) => observer.observe(el));
  }, []);

  return (
    <Container fluid="md" className="contactContent fade-in-scroll">
      <Row className="gy-4">
        <Col md={6} className="contactInfoBlock fade-in-scroll">
          <h3>{t("contact_page.info_title")}</h3>
          <p><strong>{t("contact_page.phone")}:</strong> +123 456 7890</p>
          <p><strong>{t("contact_page.email")}:</strong> info@armeniajourney.com</p>
          <p><strong>{t("contact_page.address")}:</strong> 123 Armenia St, Yerevan</p>
        </Col>

        <Col md={6} className="fade-in-scroll">
          <h3>{t("contact_page.form_title")}</h3>
          <Form onSubmit={handleSubmit} className="contactForm">
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>{t("contact_page.name")}</Form.Label>
              <Form.Control
                className="custom-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder={t("contact_page.name_placeholder")}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>{t("contact_page.email_label")}</Form.Label>
              <Form.Control
                className="custom-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder={t("contact_page.email_placeholder")}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formMessage">
              <Form.Label>{t("contact_page.message")}</Form.Label>
              <Form.Control
                className="custom-input"
                as="textarea"
                rows={6}
                name="message"
                value={formData.message}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder={t("contact_page.message_placeholder")}
              />
            </Form.Group>

            <Button type="submit" variant="success" disabled={isSubmitting} className="w-100 mt-2">
              {isSubmitting ? <Spinner as="span" animation="border" size="sm" /> : t("contact_page.send_button")}
            </Button>
          </Form>
        </Col>
      </Row>

      <Modal show={showAlert} onHide={() => setShowAlert(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#4CAF50", color: "#fff" }}>
          <Modal.Title>{t("contact_page.modal_title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "#2E7D32" }}>{t("contact_page.modal_body")}</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowAlert(false)}>
            {t("contact_page.modal_close")}
          </Button>
        </Modal.Footer>
      </Modal>

      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey="6Lc3ZHMsAAAAAOWWtv3oxB3DtuzHbvNZrdrSOdU1" 
      />

    </Container>
  );
}

// function TrustStrip() {
//   const { t } = useTranslation();

//   return (
//     <div className="trust-strip mb-5">
//       <div className="trust-item">
//         <span className="trust-icon">⚡</span>
//         <div>
//           <strong>{t("contact_page.trust_1_title", "Ответим за 2 часа")}</strong>
//           <small>{t("contact_page.trust_1_sub", "В рабочее время")}</small>
//         </div>
//       </div>
//       <div className="trust-divider" />
//       <div className="trust-item">
//         <span className="trust-icon">🛡️</span>
//         <div>
//           <strong>{t("contact_page.trust_2_title", "Безопасная оплата")}</strong>
//           <small>{t("contact_page.trust_2_sub", "Защищённый шлюз")}</small>
//         </div>
//       </div>
//       <div className="trust-divider" />
//       <div className="trust-item">
//         <span className="trust-icon">🌿</span>
//         <div>
//           <strong>{t("contact_page.trust_3_title", "500+ туристов")}</strong>
//           <small>{t("contact_page.trust_3_sub", "Довольных клиентов")}</small>
//         </div>
//       </div>
//     </div>
//   );
// }

function ContactFAQ() {
  const { t } = useTranslation();

  const faqs = [
    { q: t("contact_page.faq.faq_q1"), a: t("contact_page.faq.faq_a1") },
    { q: t("contact_page.faq.faq_q2"), a: t("contact_page.faq.faq_a2") },
    { q: t("contact_page.faq.faq_q3"), a: t("contact_page.faq.faq_a3") },
    { q: t("contact_page.faq.faq_q4"), a: t("contact_page.faq.faq_a4") },
    { q: t("contact_page.faq.faq_q5"), a: t("contact_page.faq.faq_a5") },
  ];

  return (
    <div className="tour-faq-wrapper py-5">
      <Container>
        <div className="faq-header text-center mb-5">
          <h2 className="faq-title">{t("contact_page.faq.faq_title")}</h2>
        </div>
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="faq-list">
              <Accordion flush>
                {faqs.map((faq, i) => (
                  <Accordion.Item eventKey={String(i)} key={i} className="faq-item">
                    <Accordion.Header className="faq-question">{faq.q}</Accordion.Header>
                    <Accordion.Body className="faq-answer-inner">{faq.a}</Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ContactPage;
