import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Container, Row, Col } from "react-bootstrap";
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import { 
  Plane, Hotel, Map, Utensils, 
  CheckCircle, Calendar, Users, 
  ArrowRight, Star, ShieldCheck, CreditCard 
} from "lucide-react";

import "./AllInOne.css";
// Импортируй свои изображения здесь
import heroImg from "./images/aio-hero.png"; 
import serviceImg1 from "./images/service-hotel.jpg"; // Фото отеля
import serviceImg2 from "./images/service-food.avif";  // Фото еды

function AllInOne() {
  const { t } = useTranslation();
  
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("All-in-One Request:", formData);
    // Здесь логика отправки (EmailJS или Backend)
    alert(t("aio.form.success_alert"));
  };

  return (
    <div className="aio-page">
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

      {/* --- BIG FORM SECTION --- */}
      <section className="aio-form-section" id="aio-form">
        <Container>
          <div className="aio-form-wrapper">
            <Row>
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

                  <button type="submit" className="aio-submit-btn">
                    {t("aio.form.submit_btn")}
                  </button>
                </form>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}

export default AllInOne;