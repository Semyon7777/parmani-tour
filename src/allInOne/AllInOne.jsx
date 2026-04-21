import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Container, Row, Col, Modal, Accordion } from "react-bootstrap";
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import { 
  Plane, Hotel, Map, Utensils, XCircle, 
  CheckCircle, Calendar, Users, MessageCircle, Mail, Send,
  ArrowRight, Star, ShieldCheck, CreditCard
} from "lucide-react";
import emailjs from '@emailjs/browser';

import "./AllInOne.css";

import heroImg from "./images/aio-hero.webp"; 
import serviceImg1 from "./images/service-hotel.jpg"; // Фото отеля
import serviceImg2 from "./images/service-food.avif";  // Фото еды

import SEO from "../Components/SEO";

function AllInOne() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false); // Состояние загрузки
  const [modalStatus, setModalStatus] = useState({ show: false, success: true });
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: 1,
    arrivalDate: "",
    duration: "",
    budget: "standard", // economy, standard, luxury
    notes: ""
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- ЛОГИКА ОТПРАВКИ ---
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const templateParams = {
      user_name: formData.name,
      user_email: formData.email,
      user_phone: formData.phone,
      guests: formData.guests,
      arrival_date: formData.arrivalDate,
      budget: formData.budget,
      notes: formData.notes
    };

    emailjs.send('service_zvppy78', 'template_ira1g2r', templateParams, 'P2-IFz5S0EKcKVf9p')
      .then(() => {
        setModalStatus({ show: true, success: true }); // Показываем успех
        setFormData({ name: "", email: "", phone: "", guests: 1, arrivalDate: "", budget: "standard", notes: "" });
        e.target.reset();
      })
      .catch(() => {
        setModalStatus({ show: true, success: false }); // Показываем ошибку
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleCloseModal = () => {
    setModalStatus({ ...modalStatus, show: false });
    
    // Плавная прокрутка в самый верх страницы
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  return (
    <div className="aio-page">
      <SEO
        title="All-in-One Travel Package"
        description="Complete travel packages in Armenia — tours, hotels and transport in one booking."
        url="/all-in-one"
      />
      <NavbarCustom />

      {/* --- HERO SECTION --- */}
      <header className="aio-hero">
        <div className="aio-hero-overlay"></div>
        <div className="aio-hero-bg" style={{ backgroundImage: `url(${heroImg})` }}></div>
        <Container className="position-relative z-2 h-100 d-flex flex-column justify-content-center align-items-center text-center">
          <span className="aio-hero-badge">{t("aio.hero.badge")}</span>
          <h1 className="aio-hero-title">{t("aio.hero.title")}</h1>
          <p className="aio-hero-subtitle">{t("aio.hero.subtitle")}</p>
          <button className="aio-cta-btn" onClick={() => document.getElementById('aio-form').scrollIntoView({ behavior: 'smooth' })}>
            {t("aio.hero.btn")} <ArrowRight size={20} />
          </button>
        </Container>
      </header>

      {/* --- CONCEPT SECTION (THE 4 PILLARS) --- */}
      <section className="aio-concept-section">
        <Container>
          <div className="aio-section-header">
            <h2>{t("aio.concept.title")}</h2>
            <p>{t("aio.concept.desc")}</p>
          </div>

          <Row className="g-4">
            {/* 1. Transport */}
            <Col lg={3} md={6}>
              <div className="aio-service-card">
                <div className="aio-icon-circle"><Plane size={28} /></div>
                <h3>{t("aio.services.transport_title")}</h3>
                <p>{t("aio.services.transport_desc")}</p>
              </div>
            </Col>
            {/* 2. Hotels */}
            <Col lg={3} md={6}>
              <div className="aio-service-card">
                <div className="aio-icon-circle"><Hotel size={28} /></div>
                <h3>{t("aio.services.hotel_title")}</h3>
                <p>{t("aio.services.hotel_desc")}</p>
              </div>
            </Col>
            {/* 3. Tours */}
            <Col lg={3} md={6}>
              <div className="aio-service-card">
                <div className="aio-icon-circle"><Map size={28} /></div>
                <h3>{t("aio.services.tours_title")}</h3>
                <p>{t("aio.services.tours_desc")}</p>
              </div>
            </Col>
            {/* 4. Food */}
            <Col lg={3} md={6}>
              <div className="aio-service-card">
                <div className="aio-icon-circle"><Utensils size={28} /></div>
                <h3>{t("aio.services.food_title")}</h3>
                <p>{t("aio.services.food_desc")}</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* --- VISUAL SPLIT SECTION --- */}
      <section className="aio-visual-section">
        <Container fluid className="p-0">
          <Row className="g-0 align-items-center">
            <Col lg={6}>
              <div className="aio-visual-img">
                <img src={serviceImg1} alt="Luxury Hotel" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="aio-visual-content">
                <h3>{t("aio.details.hotel_header")}</h3>
                <p>{t("aio.details.hotel_text")}</p>
                <ul className="aio-check-list">
                  <li><CheckCircle size={18} /> {t("aio.details.check1")}</li>
                  <li><CheckCircle size={18} /> {t("aio.details.check2")}</li>
                  <li><CheckCircle size={18} /> {t("aio.details.check3")}</li>
                </ul>
              </div>
            </Col>
          </Row>
          <Row className="g-0 align-items-center flex-row-reverse">
            <Col lg={6}>
              <div className="aio-visual-img">
                <img src={serviceImg2} alt="Delicious Food" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="aio-visual-content">
                <h3>{t("aio.details.food_header")}</h3>
                <p>{t("aio.details.food_text")}</p>
                <ul className="aio-check-list">
                  <li><CheckCircle size={18} /> {t("aio.details.check4")}</li>
                  <li><CheckCircle size={18} /> {t("aio.details.check5")}</li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* --- HOW IT WORKS (TIMELINE) --- */}
      <section className="aio-process-section">
        <Container>
          <div className="aio-section-header">
            <h2>{t("aio.process.title")}</h2>
          </div>
          <div className="aio-steps-grid">
            <div className="aio-step">
              <span className="aio-step-num">01</span>
              <h4>{t("aio.process.step1_title")}</h4>
              <p>{t("aio.process.step1_desc")}</p>
            </div>
            <div className="aio-step">
              <span className="aio-step-num">02</span>
              <h4>{t("aio.process.step2_title")}</h4>
              <p>{t("aio.process.step2_desc")}</p>
            </div>
            <div className="aio-step">
              <span className="aio-step-num">03</span>
              <h4>{t("aio.process.step3_title")}</h4>
              <p>{t("aio.process.step3_desc")}</p>
            </div>
            <div className="aio-step">
              <span className="aio-step-num">04</span>
              <h4>{t("aio.process.step4_title")}</h4>
              <p>{t("aio.process.step4_desc")}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* --- QUICK CONTACT BOX --- */}
      <div className="aio-quick-contact-wrapper mb-5">
        <div className="quick-contact-card">
          <div className="quick-contact-text">
            <h4>{t("aio.quick.title", "Want a faster response?")}</h4>
            <p>{t("aio.quick.desc", "Message us directly. We usually reply within 15 minutes.")}</p>
          </div>
          <div className="quick-contact-actions">
            <a href="https://wa.me/your_number" target="_blank" rel="noreferrer" className="q-btn whatsapp">
              <MessageCircle size={20} /> WhatsApp
            </a>
            <a href="mailto:your_email@gmail.com" className="q-btn email">
              <Mail size={20} /> Gmail
            </a>
            <a href="https://t.me/your_username" target="_blank" rel="noreferrer" className="q-btn telegram">
              <Send size={20} /> Telegram
            </a>
          </div>
        </div>
      </div>

      {/* --- BIG FORM SECTION --- */}
      <section className="aio-form-section" id="aio-form">
        <Container>
          <div className="aio-form-wrapper">
            <Row className="align-items-stretch g-0">
              <Col lg={5} className="aio-form-info">
                <h3>{t("aio.form.info_title")}</h3>
                <p>{t("aio.form.info_desc")}</p>
                <div className="aio-trust-badges">
                  <div className="badge-item"><ShieldCheck /> {t("aio.badges.secure")}</div>
                  <div className="badge-item"><Star /> {t("aio.badges.quality")}</div>
                  <div className="badge-item"><Users /> {t("aio.badges.support")}</div>
                </div>
              </Col>
              <Col lg={7}>
                <form className="aio-main-form" onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <div className="aio-input-group">
                        <label>{t("aio.form.label_name")}</label>
                        <input type="text" name="name" required onChange={handleInputChange} className="aio-input" />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="aio-input-group">
                        <label>{t("aio.form.label_email")}</label>
                        <input type="email" name="email" required onChange={handleInputChange} className="aio-input" />
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <div className="aio-input-group">
                        <label>{t("aio.form.label_phone")}</label>
                        <input type="tel" name="phone" required onChange={handleInputChange} className="aio-input" />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="aio-input-group">
                        <label>{t("aio.form.label_guests")}</label>
                        <div className="aio-icon-input">
                          <Users size={18} />
                          <input type="number" name="guests" min="1" defaultValue="1" onChange={handleInputChange} className="aio-input" />
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <div className="aio-input-group">
                        <label>{t("aio.form.label_date")}</label>
                        <div className="aio-icon-input">
                          <Calendar size={18} />
                          <input type="date" name="arrivalDate" onChange={handleInputChange} className="aio-input" />
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="aio-input-group">
                        <label>{t("aio.form.label_budget")}</label>
                        <div className="aio-icon-input">
                          <CreditCard size={18} />
                          <select name="budget" onChange={handleInputChange} className="aio-input">
                            <option value="standard">{t("aio.form.budget_standard")}</option>
                            <option value="economy">{t("aio.form.budget_economy")}</option>
                            <option value="luxury">{t("aio.form.budget_luxury")}</option>
                          </select>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <div className="aio-input-group">
                    <label>{t("aio.form.label_notes")}</label>
                    <textarea name="notes" rows="3" placeholder={t("aio.form.placeholder_notes")} onChange={handleInputChange} className="aio-input"></textarea>
                  </div>
                  {/* Обновляем кнопку, чтобы она показывала загрузку */}
                  <button 
                    type="submit" 
                    className="aio-submit-btn" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : t("aio.form.submit_btn")}
                  </button>
                </form>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="aio-faq-section py-5">
        <Container>
          <div className="aio-section-header text-center mb-5">
            <span className="aio-hero-badge mb-2 d-inline-block">{t("aio.faq.badge")}</span>
            <h2>{t("aio.faq.title")}</h2>
          </div>
          
          <Row className="justify-content-center">
            <Col lg={9}>
              <Accordion flush className="aio-custom-accordion">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>{t("aio.faq.q1")}</Accordion.Header>
                  <Accordion.Body>{t("aio.faq.a1")}</Accordion.Body>
                </Accordion.Item>
                
                <Accordion.Item eventKey="1">
                  <Accordion.Header>{t("aio.faq.q2")}</Accordion.Header>
                  <Accordion.Body>{t("aio.faq.a2")}</Accordion.Body>
                </Accordion.Item>
                
                <Accordion.Item eventKey="2">
                  <Accordion.Header>{t("aio.faq.q3")}</Accordion.Header>
                  <Accordion.Body>{t("aio.faq.a3")}</Accordion.Body>
                </Accordion.Item>
                
                <Accordion.Item eventKey="3">
                  <Accordion.Header>{t("aio.faq.q4")}</Accordion.Header>
                  <Accordion.Body>{t("aio.faq.a4")}</Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />


      {/* --- SUCCESS / ERROR MODAL --- */}
      <Modal 
        show={modalStatus.show} 
        onHide={handleCloseModal} // При клике на крестик или фон
        centered
        className="aio-status-modal"
      >
        <Modal.Body className="text-center p-5">
          {modalStatus.success ? (
            <>
              <CheckCircle size={80} color="#2d5a27" className="mb-4" />
              <h2 className="fw-bold">{t("aio.modal.success_title", "Success!")}</h2>
              <p className="text-muted mb-4">
                {t("aio.modal.success_msg", "Your request has been sent. Our manager will contact you shortly.")}
              </p>
            </>
          ) : (
            <>
              <XCircle size={80} color="#eb4d4b" className="mb-4" />
              <h2 className="fw-bold">{t("aio.modal.error_title", "Error")}</h2>
              <p className="text-muted mb-4">
                {t("aio.modal.error_msg", "Something went wrong. Please try again or contact us directly.")}
              </p>
            </>
          )}
          <button 
            className="aio-submit-btn w-100" 
            onClick={handleCloseModal} // При клике на кнопку закрытия
          >
            {t("aio.modal.close_btn", "Close")}
          </button>
        </Modal.Body>
      </Modal>


    </div>
  );
}

export default AllInOne;