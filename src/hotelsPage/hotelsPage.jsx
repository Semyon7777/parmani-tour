import React, { useEffect, useState } from "react";
import { Container, Row, Col, Carousel, Form, Accordion } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaWhatsapp, FaEnvelope, FaStar, FaShieldAlt, FaHeadset, FaGem, FaPlus } from "react-icons/fa";
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./hotelsPage.css";

const HotelsPage = () => {
  const { t } = useTranslation();
  const [visibleCount, setVisibleCount] = useState(6); // Показываем 6 сначала
  const phone = "37493641069";
  const email = "info@yourtravel.am";

  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, []);

  const handleWhatsApp = (text = "") => {
    const message = text || "Hello! I need hotel assistance in Armenia.";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  // Пример массива (добавь свои 50 штук сюда)
  const allHotels = [
    { 
      id: 1, 
      key: "luxury_yerevan", 
      rating: 5, 
      images: [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
      ] 
    },
    { 
      id: 2, 
      key: "sevan_resort", 
      rating: 5, 
      images: [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
      ] 
    },
    { id: 3, 
      key: "dilijan_lodge", 
      rating: 4, 
      images: [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
      ] 
    },
    { id: 4, key: "tsaghkadzor_spa", rating: 5, images: ["/images/t1.jpg", "/images/t2.jpg", "/images/t3.jpg"] },
    { id: 5, key: "goris_boutique", rating: 4, images: ["/images/g1.jpg", "/images/g2.jpg", "/images/g3.jpg"] },
    { id: 6, key: "jermuk_resort", rating: 5, images: ["/images/j1.jpg", "/images/j2.jpg", "/images/j3.jpg"] },
    { id: 7, key: "goris_boutique", rating: 4, images: ["/images/g1.jpg", "/images/g2.jpg", "/images/g3.jpg"] },
    { id: 8, key: "jermuk_resort", rating: 5, images: ["/images/j1.jpg", "/images/j2.jpg", "/images/j3.jpg"] },
    // ... и так далее до 50
  ];

  const showMore = () => setVisibleCount(prev => prev + 6);

  return (
    <div className="hotels-page-wrapper">
      <NavbarCustom />

      {/* HERO SECTION */}
      <section className="hotels-hero">
        <div className="hero-inner">
          <Container>
            <div className="hero-text-box fade-up">
              <span className="badge-exclusive">{t("hotels_page.badge")}</span>
              <h1>{t("hotels_page.hero_title")}</h1>
              <p>{t("hotels_page.hero_subtitle")}</p>
              <div className="hero-actions">
                <button className="btn-whatsapp-lg" onClick={() => handleWhatsApp()}>
                  <FaWhatsapp /> {t("hotels_page.chat_now")}
                </button>
                <a href="#hotels-list" className="link-explore">{t("hotels_page.view_collection")}</a>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* WHY CHOOSE US - Элегантные карточки */}
      <section className="features-section">
        <Container>
          <Row className="g-4">
            {[
              { icon: <FaGem />, title: "why_1_title", text: "why_1_text" },
              { icon: <FaShieldAlt />, title: "why_2_title", text: "why_2_text" },
              { icon: <FaHeadset />, title: "why_3_title", text: "why_3_text" }
            ].map((item, idx) => (
              <Col md={4} key={idx}>
                <div className="feature-card fade-up">
                  <div className="feature-icon">{item.icon}</div>
                  <h4>{t(`hotels_page.${item.title}`)}</h4>
                  <p>{t(`hotels_page.${item.text}`)}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* HOTELS LIST */}
      <section id="hotels-list" className="hotels-grid-section">
        <Container>
          <div className="section-title text-center">
            <h2>{t("hotels_page.list_title")}</h2>
            <div className="title-line"></div>
          </div>
          <Row className="g-4">
            {allHotels.slice(0, visibleCount).map((hotel) => (
              <Col lg={4} md={6} key={hotel.id}>
                <div className="premium-card fade-up">
                  <Carousel interval={null} indicators={false} className="card-carousel">
                    {hotel.images.map((img, i) => (
                      <Carousel.Item key={i}>
                        <div className="card-img" style={{ backgroundImage: `url(${img})` }} />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                  <div className="card-details">
                    <div className="card-rating">
                      {[...Array(hotel.rating)].map((_, i) => <FaStar key={i} />)}
                    </div>
                    <h4>{t(`hotels_page.items.${hotel.key}.title`)}</h4>
                    <p>{t(`hotels_page.items.${hotel.key}.description`)}</p>
                    <button className="btn-request" onClick={() => handleWhatsApp(t(`hotels_page.items.${hotel.key}.title`))}>
                      {t("hotels_page.request_offer")}
                    </button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
          
          {visibleCount < allHotels.length && (
            <div className="text-center mt-5">
              <button className="btn-load-more" onClick={showMore}>
                <FaPlus /> {t("hotels_page.load_more")}
              </button>
            </div>
          )}
        </Container>
      </section>

      {/* SECTION: CONTACT OPTIONS ABOVE FORM */}
      <section className="pre-form-contacts py-5">
        <Container>
          <div className="contact-highlight-box fade-up">
            <div className="highlight-header text-center mb-4">
              <span className="fast-badge">{t("hotels_page.fast_booking")}</span>
              <h2 className="text-white fw-bold mt-3">{t("hotels_page.contact_expert_title")}</h2>
            </div>
            
            <div className="contact-options-wrapper">
              {/* WhatsApp - сделаем его чуть больше или ярче */}
              <div className="contact-option-card wa-card preferred" onClick={() => handleWhatsApp()}>
                <div className="option-icon"><FaWhatsapp /></div>
                <div className="option-text">
                  <span>{t("hotels_page.chat_us")}</span>
                  <h5>WhatsApp Chat</h5>
                </div>
              </div>

              <div className="contact-option-card mail-card" onClick={() => window.location.href=`mailto:${email}`}>
                <div className="option-icon"><FaEnvelope /></div>
                <div className="option-text">
                  <span>{t("hotels_page.write_us")}</span>
                  <h5>{email}</h5>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION: BOOKING FORM */}
      <section className="final-form-section">
        <Container>
          <div className="form-container-box fade-up">
            <div className="form-inner-header">
              <h3>{t("hotels_page.form_title")}</h3>
              <p>{t("hotels_page.form_subtitle_extra")}</p>
            </div>

            <Form className="hotels-booking-form">
              <Row className="g-3">
                <Col md={6}>
                  <Form.Control type="text" placeholder={t("hotels_page.form_name")} className="form-input-field" />
                </Col>
                <Col md={6}>
                  <Form.Control type="email" placeholder={t("hotels_page.form_email")} className="form-input-field" />
                </Col>
                <Col md={4}>
                  <div className="input-with-label">
                    <label>Check-in</label>
                    <Form.Control type="date" className="form-input-field" />
                  </div>
                </Col>
                <Col md={4}>
                  <div className="input-with-label">
                    <label>Check-out</label>
                    <Form.Control type="date" className="form-input-field" />
                  </div>
                </Col>
                <Col md={4}>
                  <div className="input-with-label">
                    <label>Guests</label>
                    <Form.Control type="number" placeholder="2" className="form-input-field" />
                  </div>
                </Col>
                <Col xs={12}>
                  <button type="button" className="form-submit-btn" onClick={() => handleWhatsApp("New Booking Request")}>
                    {t("hotels_page.send_request")}
                  </button>
                </Col>
              </Row>
            </Form>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-5 faq-section">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">{t("hotels_page.faq_title")}</h2>
            <div className="title-underline gold mx-auto"></div>
          </div>
          <div className="mx-auto" style={{maxWidth: "800px"}}>
            <Accordion defaultActiveKey="0" flush>
              {[1, 2, 3, 4].map((id) => (
                <Accordion.Item eventKey={String(id)} key={id} className="mb-3 border-0 shadow-sm rounded">
                  <Accordion.Header className="rounded">{t(`hotels_page.faq.faq_${id}_q`)}</Accordion.Header>
                  <Accordion.Body className="bg-light-green">{t(`hotels_page.faq.faq_${id}_a`)}</Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>
        </Container>
      </section>

      <button className="float-wa" onClick={() => handleWhatsApp()}><FaWhatsapp /></button>
      <Footer />
    </div>
  );
};

export default HotelsPage;