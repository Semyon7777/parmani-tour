import React, { useEffect, useState } from "react";
import { Container, Row, Col, Carousel, Form, Accordion } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaWhatsapp, FaEnvelope, FaStar, FaShieldAlt, FaHeadset, FaGem, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { supabase } from "../supabaseClient"; // Импортируем клиент
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./hotelsPage.css";

const HotelsPage = () => {
  const { t } = useTranslation();
  const [hotels, setHotels] = useState([]); // Состояние для отелей из БД
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 6;
  

  const phone = "37493641069";
  const email = "info@yourtravel.am";

  useEffect(() => { 
    fetchHotels(); // Загружаем данные при старте

    window.scrollTo(0, 0); 

  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      // Делаем запрос к таблице 'hotels'
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .eq('is_active', true); // Берем только активные

      if (error) throw error;
      setHotels(data || []);
    } catch (error) {
      console.error("Error fetching hotels:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Вся логика пагинации остается такой же, но теперь используем массив hotels
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPages = Math.ceil(hotels.length / hotelsPerPage);

  if (loading) return <div className="text-center py-5">Loading luxury...</div>;

  const handleWhatsApp = (text = "") => {
    const message = text || "Hello! I need hotel assistance in Armenia.";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;

    setCurrentPage(pageNumber);

    const element = document.getElementById("hotels-list");

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  return (
    <div className="hotels-page-wrapper">
      <NavbarCustom />

      {/* HERO SECTION (без изменений) */}
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

      {/* WHY CHOOSE US (без изменений) */}
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

      {/* HOTELS LIST - Теперь с пагинацией */}
      <section id="hotels-list" className="hotels-grid-section">
        <Container>
          <div className="section-title text-center">
            <h2>{t("hotels_page.list_title")}</h2>
            <div className="title-line"></div>
          </div>

          <Row className="g-4">
            {currentHotels.map((hotel) => (
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
          
          {/* КНОПКИ ПАГИНАЦИИ */}
          {totalPages > 1 && (
            <div className="pagination-container">

              <button
                className="pagin-btn arrow"
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
              >
                <FaChevronLeft />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page =>
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1
                )
                .map((page, index, arr) => {

                  const prev = arr[index - 1];

                  return (
                    <React.Fragment key={page}>
                      {prev && page - prev > 1 && (
                        <span className="pagination-dots">...</span>
                      )}

                      <button
                        className={`pagin-btn num ${
                          currentPage === page ? "active" : ""
                        }`}
                        onClick={() => paginate(page)}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}

              <button
                className="pagin-btn arrow"
                disabled={currentPage === totalPages}
                onClick={() => paginate(currentPage + 1)}
              >
                <FaChevronRight />
              </button>

            </div>
          )}
        </Container>
      </section>

      {/* Блок контактов и форма (без изменений) */}
      <section className="pre-form-contacts py-5">
        <Container>
          <div className="contact-highlight-box fade-up">
            <div className="highlight-header text-center mb-4">
              <span className="fast-badge">{t("hotels_page.fast_booking")}</span>
              <h2 className="text-white fw-bold mt-3">{t("hotels_page.contact_expert_title")}</h2>
            </div>
            
            <div className="contact-options-wrapper">
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

      {/* BOOKING FORM (без изменений) */}
      <section className="final-form-section">
        <Container>
          <div className="form-container-box fade-up">
            <div className="form-inner-header">
              <h3>{t("hotels_page.form_title")}</h3>
              <p>{t("hotels_page.form_subtitle_extra")}</p>
            </div>
            <Form className="hotels-booking-form">
               {/* Твои поля формы */}
               <Row className="g-3">
                  <Col md={6}><Form.Control type="text" placeholder={t("hotels_page.form_name")} className="form-input-field" /></Col>
                  <Col md={6}><Form.Control type="email" placeholder={t("hotels_page.form_email")} className="form-input-field" /></Col>
                  <Col md={4}><div className="input-with-label"><label>Check-in</label><Form.Control type="date" className="form-input-field" /></div></Col>
                  <Col md={4}><div className="input-with-label"><label>Check-out</label><Form.Control type="date" className="form-input-field" /></div></Col>
                  <Col md={4}><div className="input-with-label"><label>Guests</label><Form.Control type="number" placeholder="2" className="form-input-field" /></div></Col>
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

      {/* FAQ (без изменений) */}
      <section className="py-5 faq-section">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">{t("hotels_page.faq_title")}</h2>
            <div className="title-underline gold mx-auto"></div>
          </div>
          <div className="mx-auto" style={{maxWidth: "800px"}}>
            <Accordion defaultActiveKey="0" flush>
              {[1, 2, 3, 4].map((id) => (
                <Accordion.Item eventKey={String(id)} key={id} className="border-0 shadow-sm rounded mb-2">
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