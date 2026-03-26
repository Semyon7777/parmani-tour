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

      {/* ── TRUST STRIP ── */}
      {/* <Container className="mt-4 mb-2">
        <TrustStrip />
      </Container> */}

      <Container className="my-5">
        <Row className="g-4">
          {/* Левая колонка: форма */}
          <Col lg={8}>
            <div className="tour-form-container shadow-sm">
              <ContactWithUs />
            </div>
          </Col>

          {/* Правая колонка */}
          <Col lg={4}>
            <div className="d-flex flex-column gap-4 messenger-block-container">

              {/* Мессенджеры */}
              <Card className="border-0 shadow-sm tour-side-card">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-3 tour-text-green">{t("contact_page.reach_us", "Свяжитесь с нами")}</h5>
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

              {/* Контакты */}
              <Card className="border-0 shadow-sm tour-side-card tour-bg-mint">
                <Card.Body className="p-4">
                  <div className="d-flex mb-3 align-items-start">
                    <div className="tour-icon-circle me-3"><FaMapMarkerAlt /></div>
                    <div>
                      <h6 className="fw-bold mb-0">{t("contact_page.office", "Офис")}</h6>
                      <small className="text-muted">Yerevan, Armenia</small>
                    </div>
                  </div>
                  <div className="d-flex mb-3 align-items-start">
                    <div className="tour-icon-circle me-3"><FaPhoneAlt /></div>
                    <div>
                      <h6 className="fw-bold mb-0">{t("contact_page.phone", "Телефон")}</h6>
                      <small className="text-muted">+374 XX XXX XXX</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-start">
                    <div className="tour-icon-circle me-3"><FaClock /></div>
                    <div>
                      <h6 className="fw-bold mb-0">{t("contact_page.hours", "Часы работы")}</h6>
                      <small className="text-muted">{t("contact_page.hours_value", "Пн-Вс: 09:00 — 21:00")}</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>

            </div>
          </Col>
        </Row>
      </Container>

      {/* ── CONCIERGE SECTION ── */}
      <ConciergeSection />

      {/* FAQ */}
      <ContactFAQ />

      <Footer />
    </div>
  );
}


// ─── TRUST STRIP ─────────────────────────────────────────────
// function TrustStrip() {
//   const { t } = useTranslation();

//   const items = [
//     { icon: "⚡", title: t("contact_page.trust_1_title", "Ответим за 2 часа"), sub: t("contact_page.trust_1_sub", "В рабочее время") },
//     { icon: "🛡️", title: t("contact_page.trust_2_title", "Безопасное бронирование"), sub: t("contact_page.trust_2_sub", "Данные под защитой") },
//     { icon: "🌿", title: t("contact_page.trust_3_title", "500+ туристов"), sub: t("contact_page.trust_3_sub", "Довольных клиентов") },
//     { icon: "🗺️", title: t("contact_page.trust_4_title", "Местные гиды"), sub: t("contact_page.trust_4_sub", "Знаем Армению изнутри") },
//   ];

//   return (
//     <div className="trust-strip">
//       {items.map((item, i) => (
//         <React.Fragment key={i}>
//           <div className="trust-item">
//             <span className="trust-icon">{item.icon}</span>
//             <div>
//               <strong>{item.title}</strong>
//               <small>{item.sub}</small>
//             </div>
//           </div>
//           {i < items.length - 1 && <div className="trust-divider" />}
//         </React.Fragment>
//       ))}
//     </div>
//   );
// }


// ─── CONCIERGE SECTION ───────────────────────────────────────
function ConciergeSection() {
  const { t } = useTranslation();

  const services = [
    {
      icon: "🕐",
      title: t("contact_page.concierge.s1_title", "Поддержка 24/7"),
      text: t("contact_page.concierge.s1_text", "Мы на связи в любое время суток — до, во время и после вашей поездки. Помогаем решить любой вопрос."),
    },
    {
      icon: "🍽️",
      title: t("contact_page.concierge.s2_title", "Бронирование ресторанов"),
      text: t("contact_page.concierge.s2_text", "Зарезервируем столик в лучших ресторанах Еревана и регионов. Скажем где вкуснее всего."),
    },
    {
      icon: "🗺️",
      title: t("contact_page.concierge.s3_title", "Персональные рекомендации"),
      text: t("contact_page.concierge.s3_text", "Подберём маршрут, места и активности под ваши интересы. Никаких шаблонных туристических маршрутов."),
    },
    {
      icon: "🚗",
      title: t("contact_page.concierge.s4_title", "Трансфер и логистика"),
      text: t("contact_page.concierge.s4_text", "Организуем трансфер из аэропорта, между городами и к любым достопримечательностям."),
    },
    {
      icon: "💬",
      title: t("contact_page.concierge.s5_title", "Помощь с языком"),
      text: t("contact_page.concierge.s5_text", "Наши гиды говорят на русском, английском и армянском. Поможем с переводом и общением с местными."),
    },
    {
      icon: "🏨",
      title: t("contact_page.concierge.s6_title", "Подбор отелей"),
      text: t("contact_page.concierge.s6_text", "Посоветуем лучшие варианты размещения в любом бюджете — от бутик-отелей до уютных гостевых домов."),
    },
  ];

  return (
    <section className="concierge-section">
      <Container>
        {/* Заголовок */}
        <div className="concierge-header">
          <div className="concierge-badge">
            {t("contact_page.concierge.badge", "Персональный сервис")}
          </div>
          <h2 className="concierge-title">
            {t("contact_page.concierge.title", "Ваш личный консьерж в Армении")}
          </h2>
          <p className="concierge-subtitle">
            {t("contact_page.concierge.subtitle", "Мы не просто продаём туры — мы сопровождаем вас на каждом шагу путешествия. Доступны 24/7.")}
          </p>
        </div>

        {/* Карточки сервисов */}
        <Row className="g-4 mb-5">
          {services.map((s, i) => (
            <Col md={6} lg={4} key={i}>
              <div className="concierge-card">
                <div className="concierge-card-icon">{s.icon}</div>
                <h5 className="concierge-card-title">{s.title}</h5>
                <p className="concierge-card-text">{s.text}</p>
              </div>
            </Col>
          ))}
        </Row>

        {/* CTA внутри секции */}
        <div className="concierge-cta">
          <div className="concierge-cta-inner">
            <div className="concierge-cta-left">
              <div className="concierge-live-dot">
                <span className="live-pulse" />
                <span>{t("contact_page.concierge.online", "Консьерж онлайн")}</span>
              </div>
              <h3>{t("contact_page.concierge.cta_title", "Готовы помочь прямо сейчас")}</h3>
              <p>{t("contact_page.concierge.cta_text", "Напишите нам — ответим в течение нескольких минут.")}</p>
            </div>
            <div className="concierge-cta-right">
              <a href="https://wa.me/your_number" target="_blank" rel="noreferrer" className="concierge-cta-btn wa">
                <FaWhatsapp /> WhatsApp
              </a>
              <a href="https://t.me/your_username" target="_blank" rel="noreferrer" className="concierge-cta-btn tg">
                <FaTelegramPlane /> Telegram
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}


// ─── ФОРМА КОНТАКТА ───────────────────────────────────────────
function ContactWithUs() {
  const { t } = useTranslation();
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const token = await recaptchaRef.current.executeAsync();
      if (!token) { setErrorMessage("Captcha verification failed."); setIsSubmitting(false); return; }

      const serviceID  = "service_fkaou6c";
      const templateID = "template_taw2p8j";
      const publicKey  = "IUMzWx8Tsm9hYF3UR";

      const templateParams = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        subject: "New Message from Website",
        'g-recaptcha-response': token
      };

      emailjs.init(publicKey);
      await emailjs.send(serviceID, templateID, templateParams, publicKey);

      setShowAlert(true);
      setFormData({ name: "", email: "", message: "" });
      recaptchaRef.current.reset();

    } catch (err) {
      console.error('FAILED...', err);
      setErrorMessage(t("contact_page.error_send") + " (" + (err.text || "Check console") + ")");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }); },
      { threshold: 0.2 }
    );
    document.querySelectorAll(".contactContent, .contactInfoBlock").forEach(el => observer.observe(el));
  }, []);

  return (
    <Container fluid="md" className="contactContent fade-in-scroll">
      <Row className="gy-4">
        <Col md={6} className="contactInfoBlock fade-in-scroll">
          <h3>{t("contact_page.info_title")}</h3>
          <p><strong>{t("contact_page.phone")}:</strong> +374 XX XXX XXX</p>
          <p><strong>{t("contact_page.email")}:</strong> info@parmanitour.com</p>
          <p><strong>{t("contact_page.address")}:</strong> Yerevan, Armenia</p>
        </Col>

        <Col md={6} className="fade-in-scroll">
          <h3>{t("contact_page.form_title")}</h3>
          <Form onSubmit={handleSubmit} className="contactForm">
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>{t("contact_page.name")}</Form.Label>
              <Form.Control className="custom-input" type="text" name="name" value={formData.name} onChange={handleChange} disabled={isSubmitting} placeholder={t("contact_page.name_placeholder")} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>{t("contact_page.email_label")}</Form.Label>
              <Form.Control className="custom-input" type="email" name="email" value={formData.email} onChange={handleChange} disabled={isSubmitting} placeholder={t("contact_page.email_placeholder")} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formMessage">
              <Form.Label>{t("contact_page.message")}</Form.Label>
              <Form.Control className="custom-input" as="textarea" rows={2} name="message" value={formData.message} onChange={handleChange} disabled={isSubmitting} placeholder={t("contact_page.message_placeholder")} />
            </Form.Group>

            <Button type="submit" variant="success" disabled={isSubmitting} className="w-100 mt-2">
              {isSubmitting ? <Spinner as="span" animation="border" size="sm" /> : t("contact_page.send_button")}
            </Button>

            {/* Добавляем этот блок текста */}
            <p className="recaptcha-disclaimer mt-3">
              This site is protected by reCAPTCHA and the Google 
              <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer"> Privacy Policy</a> and 
              <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer"> Terms of Service</a> apply.
            </p>
          </Form>
        </Col>
      </Row>

      <Modal show={showAlert} onHide={() => setShowAlert(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#4CAF50", color: "#fff" }}>
          <Modal.Title>{t("contact_page.modal_title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "#2E7D32" }}>{t("contact_page.modal_body")}</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowAlert(false)}>{t("contact_page.modal_close")}</Button>
        </Modal.Footer>
      </Modal>

      <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey="6Lc3ZHMsAAAAAOWWtv3oxB3DtuzHbvNZrdrSOdU1" />
    </Container>
  );
}


// ─── FAQ ──────────────────────────────────────────────────────
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