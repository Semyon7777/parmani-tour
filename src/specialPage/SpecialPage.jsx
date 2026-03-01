import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { Container, Row, Col, Form, Modal, Button, Accordion, Alert, Spinner } from "react-bootstrap";
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Map, Bus, BookOpen, Utensils, Send, CheckCircle, GraduationCap,
   Plus, Trash2, FileText, MapPin, ChevronLeft, ChevronRight, MessageCircle, Mail } from "lucide-react";
import emailjs from '@emailjs/browser';
import customTourBuilderImg from "./images/Custom-Tour-Builder.png"
import "./SpecialPage.css";

function SpecialPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // --- ЛОГИКА ВКЛАДОК И URL ---
  // Читаем ?tab= из URL, если его нет — ставим "custom"
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") || "custom";
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [alertInfo, setAlertInfo] = useState({ show: false, variant: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const alertRef = React.useRef(null);

  // Синхронизация: если URL изменился (клик в Navbar), меняем вкладку
  // Синхронизация: если URL изменился (клик в Navbar), меняем вкладку
  useEffect(() => {

    window.scrollTo(0, 0);

    const tabFromUrl = new URLSearchParams(location.search).get("tab");
    // Проверяем, что в URL есть вкладка, и она отличается от текущей
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [location.search, activeTab]); // Теперь activeTab в зависимостях, и ESLint доволен

  // Функция смены вкладки с обновлением URL (useCallback важен для стабильности)
  const handleTabChange = React.useCallback((tabName) => {
    setActiveTab(tabName);
    navigate(`?tab=${tabName}`, { replace: true });
  }, [navigate]);

  // --- СОСТОЯНИЯ ФОРМЫ ---
  const [destinations, setDestinations] = useState([""]);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    peopleCount: 1,
    date: "",
    wishes: ""
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const tabFromUrl = new URLSearchParams(location.search).get("tab");
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [location.search, activeTab]);

  const addDestination = () => setDestinations([...destinations, ""]);

  const handleDestChange = (index, value) => {
    const updatedDestinations = [...destinations];
    updatedDestinations[index] = value;
    setDestinations(updatedDestinations);
  };

  const removeDestination = (index) => {
    if (destinations.length > 1) {
      setDestinations(destinations.filter((_, i) => i !== index));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleShowPreview = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);

    const formattedDestinations = destinations
      .filter(d => d.trim() !== "")
      .map((d, i) => `${i + 1}. ${d}`)
      .join("\n");

    const templateParams = {
      tour_type: activeTab === "custom" ? "Custom Tour Builder" : "School Tour",
      email: formData.email,
      phone: formData.phone,
      people: formData.peopleCount,
      date: formData.date,
      destinations: activeTab === "custom" ? formattedDestinations : "Fixed School Program",
      wishes: formData.wishes || "No special wishes",
    };

    emailjs.send(
      'service_zvppy78',
      'template_mpwegyd',
      templateParams, 
      'P2-IFz5S0EKcKVf9p'
    )
    .then(() => {
        setShowModal(false); 
        setAlertInfo({ 
          show: true, 
          variant: "success", 
          message: t("special.form.success_msg") || "Success! Your request has been sent." 
        });

        setTimeout(() => {
            alertRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);

        setDestinations([""]);
        setFormData({ email: "", phone: "", peopleCount: 1, date: "", wishes: "" });
        setTimeout(() => setAlertInfo({ show: false, variant: "", message: "" }), 8000);
    })
    .catch(() => {
        setShowModal(false);
        setAlertInfo({ 
          show: true, 
          variant: "danger", 
          message: t("special.form.error_msg") || "Error sending message." 
        });
    })
    .finally(() => {
        setIsSubmitting(false);
    });
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
              onClick={() => handleTabChange("custom")} // Используй handleTabChange!
            >
              <Map size={20} className="tab-icon" />
              {t("special.tabs.custom")}
            </button>
            <button 
              className={`tab-btn ${activeTab === "school" ? "active" : ""}`}
              onClick={() => handleTabChange("school")} // Используй handleTabChange!
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

                    {/* --- КОНТЕЙНЕР ДЛЯ АЛЕРТА С РЕФОМ --- */}
                    <div ref={alertRef}>
                      {alertInfo.show && (
                        <Alert 
                          variant={alertInfo.variant} 
                          onClose={() => setAlertInfo({ show: false, variant: "", message: "" })} 
                          dismissible
                          className={`custom-alert-${alertInfo.variant} mb-4`}
                          style={{ 
                            borderRadius: '12px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.05)' 
                          }}
                        >
                          <div className="d-flex align-items-center">
                            {alertInfo.variant === "success" && <CheckCircle size={24} className="me-3"/>}
                            <div>
                              <strong>{alertInfo.variant === "success" ? "Done!" : "Oops!"}</strong>
                              <div className="small">{alertInfo.message}</div>
                            </div>
                          </div>
                        </Alert>
                      )}
                    </div>

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

              {/* === БЛОК ПРЯМОЙ СВЯЗИ === */}
                <div className="sp-direct-contact-box">
                  <div className="sp-direct-content">
                    <div className="sp-direct-text">
                      <h4>{t("special.direct.title", "Have more questions?")}</h4>
                      <p>{t("special.direct.desc", "Skip the form and reach us directly via your favorite platform.")}</p>
                    </div>
                    <div className="sp-direct-actions">
                      <a href="https://wa.me/yournumber" target="_blank" rel="noreferrer" className="sp-action-link whatsapp">
                        <MessageCircle size={20} />
                        <span>WhatsApp</span>
                      </a>
                      <a href="mailto:your@email.com" className="sp-action-link email">
                        <Mail size={20} />
                        <span>Email</span>
                      </a>
                    </div>
                  </div>
                </div>
              {/* {CustomFAQ()} */}
              <CustomFAQ t={t} />
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

              <SchoolToursAlbum />

              <div className="school-cta-banner">
                <div className="school-cta-content">
                  <h3>{t("special.school.cta_title")}</h3>
                  <p>{t("special.school.cta_text")}</p>
                  <div className="cta-buttons">
                    <button className="btn-primary-school">{t("special.school.cta_btn")}</button>
                  </div>
                </div>
              </div>
              {/* {SchoolFAQ()} */}
              <SchoolFAQ t={t} />
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
          <Button 
            className="btn-confirm-final" 
            variant="success"
            onClick={handleFinalSubmit}
            disabled={isSubmitting} // Блокируем
          >
            {isSubmitting ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                {t("special.modal.sending") || "Sending..."}
              </>
            ) : (
              t("special.modal.confirm")
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );




function SchoolToursAlbum() {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language || 'en';
  const scrollRef = React.useRef(null);

  const schoolToursData = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=500",
      title: { en: "Matenadaran Workshop", ru: "Мастер-класс в Матенадаране", hy: "Մատենադարանի աշխատանոց" },
      location: { en: "Yerevan", ru: "Ереван", hy: "Երևան" },
      age: { en: "10-15 Years", ru: "10-15 Лет", hy: "10-15 Տարեկան" }
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=500",
      title: { en: "Amberd Fortress Quest", ru: "Квест в крепости Амберд", hy: "Ամբերդի ամրոցի քվեստ" },
      location: { en: "Aragatsotn", ru: "Арагацотн", hy: "Արագածոտն" },
      age: { en: "10-15 Years", ru: "10-15 Лет", hy: "10-15 Տարեկան" }
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=500",
      title: { en: "Eco-Trail Dilijan", ru: "Эко-тропа в Дилижане", hy: "Դիլիջանի էկո-արահետ" },
      location: { en: "Dilijan", ru: "Дилижан", hy: "Դիլիջան" },
      age: { en: "10-15 Years", ru: "10-15 Лет", hy: "10-15 Տարեկան" }
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=500",
      title: { en: "Garni Temple History", ru: "История храма Гарни", hy: "Գառնիի տաճարի պատմություն" },
      location: { en: "Garni", ru: "Гарни", hy: "Գառնի" },
      age: { en: "10-15 Years", ru: "10-15 Лет", hy: "10-15 Տարեկան" }
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=500",
      title: { en: "Observatory Night", ru: "Ночь в обсерватории", hy: "Գիշեր աստղադիտարանում" },
      location: { en: "Byurakan", ru: "Бюракан", hy: "Բյուրական" },
      age: { en: "10-15 Years", ru: "10-15 Лет", hy: "10-15 Տարեկան" }
    },
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      // clientWidth дает чистую ширину видимой области без скроллбаров
      const scrollAmount = current.clientWidth + 24; // ширина окна + gap
      
      current.scrollBy({ 
        left: direction === "left" ? -scrollAmount : scrollAmount, 
        behavior: "smooth" 
      });
    }
  };

  return (
    <div className="school-album-section">
      <Container>
        {/* Заголовок и подзаголовок */}
        <div className="album-intro text-center">
          <div className="intro-badge">
            <GraduationCap size={20} />
          </div>
          <h2 className="album-main-title">
            {t('special.school.album_title', 'Образовательные приключения')}
          </h2>
          <p className="album-subtitle">
            {t('special.school.album_subtitle', 'Уникальные программы для школьных групп: от истории до экологии')}
          </p>
        </div>

        <div className="album-relative-wrapper">
          <button className="album-arrow arrow-left" onClick={() => scroll("left")}>
            <ChevronLeft size={24} />
          </button>

          <div className="album-scroll-row" ref={scrollRef}>
            {schoolToursData.map((tour) => (
              <div className="school-album-card" key={tour.id}>
                <div className="school-card-media">
                  <img src={tour.image} alt="Tour" loading="lazy"/>
                  <span className="age-tag">{tour.age[currentLang] || tour.age['en']}</span>
                </div>
                <div className="school-card-desc">
                  <h4>{tour.title[currentLang] || tour.title['en']}</h4>
                  <p><MapPin size={14} /> {tour.location[currentLang] || tour.location['en']}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="album-arrow arrow-right" onClick={() => scroll("right")}>
            <ChevronRight size={24} />
          </button>
        </div>
      </Container>
    </div>
  );
}


// --- FAQ ДЛЯ КОНСТРУКТОРА ТУРОВ ---
function CustomFAQ({ t }) {
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
function SchoolFAQ({ t }) {
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