import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Container, Row, Col, Form, Modal, Button, Accordion } from "react-bootstrap";
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Map, Bus, BookOpen, Utensils, Send, CheckCircle, Plus, Trash2, FileText } from "lucide-react";
import customTourBuilderImg from "./images/Custom-Tour-Builder.png"
import "./SpecialPage.css";

function SpecialPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("custom");

  // --- СОСТОЯНИЯ ФОРМЫ ---
  const [destinations, setDestinations] = useState([""]); // Список мест
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    peopleCount: 1,
    date: "",
    wishes: ""
  });

  // --- МОДАЛЬНОЕ ОКНО ---
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Логика добавления нового поля для места
  const addDestination = () => {
    setDestinations([...destinations, ""]);
  };

  // Логика изменения конкретного поля места
  const handleDestChange = (index, value) => {
    const updatedDestinations = [...destinations];
    updatedDestinations[index] = value;
    setDestinations(updatedDestinations);
  };

  // Удаление поля места
  const removeDestination = (index) => {
    if (destinations.length > 1) {
      const updatedDestinations = destinations.filter((_, i) => i !== index);
      setDestinations(updatedDestinations);
    }
  };

  // Изменение обычных полей (email, phone и т.д.)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Показать превью (модалку)
  const handleShowPreview = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  // Финальная отправка
  const handleFinalSubmit = () => {
    console.log("Submitting:", { ...formData, destinations });
    setShowModal(false);
    // Здесь можно добавить уведомление об успехе
  };

  return (
    <div className="special-page">
      <NavbarCustom />

      {/* HERO SECTION */}
      <section className="special-hero">
        <div className="special-hero-content">
          <h1>{t("special.hero.title")}</h1>
          <p>{t("special.hero.subtitle")}</p>
        </div>
      </section>

      {/* TAB CONTROL */}
      <section className="tab-control-section">
        <Container>
          <div className="tab-switcher-island">
            <button 
              className={`tab-btn ${activeTab === "custom" ? "active" : ""}`}
              onClick={() => setActiveTab("custom")}
            >
              <Map size={20} className="tab-icon" />
              {t("special.tabs.custom")}
            </button>
            <button 
              className={`tab-btn ${activeTab === "school" ? "active" : ""}`}
              onClick={() => setActiveTab("school")}
            >
              <Bus size={20} className="tab-icon" />
              {t("special.tabs.school")}
            </button>
          </div>
        </Container>
      </section>

      <section className="special-content-area">
        <Container>
          
          {/* === CUSTOM TOUR BUILDER === */}
          {activeTab === "custom" && (
            <div className="content-fade-in">
              <div className="custom-route-grid">
                
                <div className="custom-text-side">
                  <span className="section-badge">{t("special.custom.badge")}</span>
                  <h2>{t("special.custom.title")}</h2>
                  <p className="description">{t("special.custom.desc")}</p>
                  
                  <ul className="benefits-list">
                    <li><CheckCircle size={18} /> {t("special.custom.benefit1")}</li>
                    <li><CheckCircle size={18} /> {t("special.custom.benefit2")}</li>
                    <li><CheckCircle size={18} /> {t("special.custom.benefit3")}</li>
                  </ul>

                  {/* === НОВЫЙ БЛОК С ИЗОБРАЖЕНИЕМ === */}
                <div className="sp-custom-image-block mt-5">
                    <img src={customTourBuilderImg} alt="Planning custom route" />
                </div>
                </div>

                <div className="custom-form-side">
                  <div className="form-island">
                    <h3>{t("special.form.header")}</h3>
                    <Form onSubmit={handleShowPreview}>
                      
                      {/* ДИНАМИЧЕСКИЕ МЕСТА */}
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">{t("special.form.places_label")}</Form.Label>
                        {destinations.map((dest, index) => (
                          <div key={index} className="destination-input-wrapper mb-2">
                            <Form.Control 
                              type="text" 
                              required
                              placeholder={`${t("special.form.place_placeholder")} ${index + 1}`}
                              value={dest}
                              onChange={(e) => handleDestChange(index, e.target.value)}
                            />
                            {destinations.length > 1 && (
                              <button type="button" className="remove-dest-btn" onClick={() => removeDestination(index)}>
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        ))}
                        <button type="button" className="add-dest-btn" onClick={addDestination}>
                          <Plus size={16} /> {t("special.form.add_place")}
                        </button>
                      </Form.Group>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>{t("special.form.email_label")}</Form.Label>
                            <Form.Control type="email" name="email" required onChange={handleInputChange} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>{t("special.form.phone_label")}</Form.Label>
                            <Form.Control type="tel" name="phone" required onChange={handleInputChange} />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>{t("special.form.people_label")}</Form.Label>
                            <Form.Control type="number" name="peopleCount" min="1" defaultValue="1" onChange={handleInputChange} />
                          </Form.Group>
                        </Col>
                        <Col xs={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>{t("special.form.date_label")}</Form.Label>
                            <Form.Control type="date" name="date" required onChange={handleInputChange} />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-4">
                        <Form.Label>{t("special.form.wishes_label")}</Form.Label>
                        <Form.Control as="textarea" rows={4} name="wishes" placeholder={t("special.form.wishes_placeholder")} onChange={handleInputChange} />
                      </Form.Group>

                      <button type="submit" className="submit-btn-full">
                        {t("special.form.submit_btn")} <Send size={18} />
                      </button>
                    </Form>
                  </div>
                </div>

              </div>
              {CustomFAQ()}
              {/* <CustomFAQ t={t} /> */}
            </div>
          )}

          {/* === SCHOOL TOURS === */}
          {activeTab === "school" && (
            <div className="content-fade-in">
              <div className="school-header text-center mb-5">
                <h2>{t("special.school.title")}</h2>
                <p>{t("special.school.subtitle")}</p>
              </div>

              <Row className="g-4 mb-5">
                <Col md={4}>
                  <div className="school-feature-card">
                    <div className="icon-box yellow"><Bus size={32} /></div>
                    <h4>{t("special.school.feat1_title")}</h4>
                    <p>{t("special.school.feat1_text")}</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="school-feature-card">
                    <div className="icon-box green"><BookOpen size={32} /></div>
                    <h4>{t("special.school.feat2_title")}</h4>
                    <p>{t("special.school.feat2_text")}</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="school-feature-card">
                    <div className="icon-box red"><Utensils size={32} /></div>
                    <h4>{t("special.school.feat3_title")}</h4>
                    <p>{t("special.school.feat3_text")}</p>
                  </div>
                </Col>
              </Row>

              <div className="school-cta-banner">
                <div className="school-cta-content">
                  <h3>{t("special.school.cta_title")}</h3>
                  <p>{t("special.school.cta_text")}</p>
                  <div className="cta-buttons">
                    <button className="btn-primary-school">{t("special.school.cta_btn")}</button>
                  </div>
                </div>
              </div>
              {SchoolFAQ()}
            </div>
          )}

        </Container>
      </section>

      {/* МОДАЛЬНОЕ ОКНО - ПРОВЕРКА ДАННЫХ (RECEIPT) */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="receipt-modal">
        <Modal.Header closeButton>
          <Modal.Title><FileText className="me-2" /> {t("special.modal.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="receipt-content">
            <div className="receipt-section mb-3">
              <label className="text-muted small">{t("special.form.places_label")}</label>
              <ul className="receipt-dest-list">
                {destinations.map((d, i) => d && <li key={i}>{d}</li>)}
              </ul>
            </div>
            <hr />
            <div className="receipt-grid">
              <div className="receipt-item">
                <span className="text-muted small d-block">{t("special.form.date_label")}</span>
                <strong>{formData.date}</strong>
              </div>
              <div className="receipt-item">
                <span className="text-muted small d-block">{t("special.form.people_label")}</span>
                <strong>{formData.peopleCount}</strong>
              </div>
              <div className="receipt-item">
                <span className="text-muted small d-block">{t("special.form.email_label")}</span>
                <strong>{formData.email}</strong>
              </div>
              <div className="receipt-item">
                <span className="text-muted small d-block">{t("special.form.phone_label")}</span>
                <strong>{formData.phone}</strong>
              </div>
            </div>
            {formData.wishes && (
              <div className="receipt-section mt-3">
                <label className="text-muted small">{t("special.form.wishes_label")}</label>
                <p className="receipt-wishes">{formData.wishes}</p>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="link" className="text-decoration-none text-muted" onClick={() => setShowModal(false)}>
            {t("special.modal.edit")}
          </Button>
          <Button className="btn-confirm-final" onClick={handleFinalSubmit}>
            {t("special.modal.confirm")}
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );



// --- FAQ ДЛЯ КОНСТРУКТОРА ТУРОВ ---
function CustomFAQ() {
  const questions = [1, 2, 3, 4, 5, 6]; // Добавь сколько нужно
  return (
    <div className="sp-faq-container">
      <h3 className="sp-faq-title">{t("special.faq.custom_title")}</h3>
      <Accordion flush className="sp-minimal-accordion">
        {questions.map((num) => (
          <Accordion.Item eventKey={num.toString()} key={num} className="sp-faq-item">
            <Accordion.Header className="sp-faq-header">
              {t(`special.faq.custom_q${num}`)}
            </Accordion.Header>
            <Accordion.Body className="sp-faq-body">
              {t(`special.faq.custom_a${num}`)}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}

// --- FAQ ДЛЯ ШКОЛЬНЫХ ТУРОВ ---
function SchoolFAQ() {
  const questions = [1, 2, 3, 4, 5, 6];
  return (
    <div className="sp-faq-container">
      <h3 className="sp-faq-title">{t("special.faq.school_title")}</h3>
      <Accordion flush className="sp-minimal-accordion">
        {questions.map((num) => (
          <Accordion.Item eventKey={num.toString()} key={num} className="sp-faq-item">
            <Accordion.Header className="sp-faq-header">
              {t(`special.faq.school_q${num}`)}
            </Accordion.Header>
            <Accordion.Body className="sp-faq-body">
              {t(`special.faq.school_a${num}`)}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}

}


export default SpecialPage;