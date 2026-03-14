import React, { useEffect, useState } from "react";
import { Container, Row, Col, Carousel, Form, Accordion, Card, Button, Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaWhatsapp, FaEnvelope, FaStar, FaShieldAlt, FaHeadset, FaGem, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { supabase } from "../supabaseClient"; // Импортируем клиент
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./hotelsPage.css";

const HotelsPage = () => {
  const { t } = useTranslation();
  const [hotels, setHotels] = useState([]); // Состояние для отелей из БД
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 6;

  const [filteredHotels, setFilteredHotels] = useState(null); // Отфильтрованные отели
  

  const phone = "37493641069";
  const email = "info@yourtravel.am";
  


  useEffect(() => {
    
    const CACHE_TIME = 10 * 60 * 1000; // 10 минут

    const cached = localStorage.getItem("hotels_cache");

    if (cached) {
      const parsed = JSON.parse(cached);

      if (Date.now() - parsed.timestamp < CACHE_TIME) {
        setHotels(parsed.data);
        setLoading(false);
        return;
      }
    }

    fetchHotels();

    window.scrollTo(0, 0);

  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("hotels")
        .select("id,name,city,rating,images,amenities,key")
        .eq("is_active", true);

      if (error) throw error;

      if (data) {
        setHotels(data);

        localStorage.setItem(
          "hotels_cache",
          JSON.stringify({
            data: data,
            timestamp: Date.now()
          })
        );
      }

    } catch (error) {
      console.error("Error fetching hotels:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredHotels]);

  // Вся логика пагинации остается такой же, но теперь используем массив hotels
  const hotelsToDisplay = filteredHotels ?? hotels;

  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;

  const currentHotels = hotelsToDisplay.slice(indexOfFirstHotel, indexOfLastHotel);

  const totalPages = Math.ceil(hotelsToDisplay.length / hotelsPerPage);

  if (loading) return <div className="text-center py-5"></div>;

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

      {/* HOTELS LIST - Теперь с пагинацией и фильтром */}
      <section id="hotels-list" className="hotels-grid-section">
        <Container>
          <div className="section-title text-center">
            <h2>{t("hotels_page.list_title")}</h2>
          </div>

          {/* ДОБАВЛЯЕМ ФИЛЬТР СЮДА */}
          <Row className="mb-4">
            <Col>
              <HotelFilter 
                hotels={hotels} 
                setFilteredHotels={setFilteredHotels} 
              />
            </Col>
          </Row>
          {/* КОНЕЦ ФИЛЬТРА */}

          {/* Если после фильтрации отелей нет, показываем сообщение */}
          {hotelsToDisplay.length === 0 ? (
            <div className="text-center my-5">
              <h4>{t("hotels_page.no_results", "Отели не найдены по вашим критериям.")}</h4>
            </div>
          ) : (
            <>
              <Row className="g-4">
                {currentHotels.map((hotel, index) => (
                  <Col lg={4} md={6} key={hotel.id}>
                    <div className="premium-card fade-up">
                      <Carousel interval={null} indicators={false} className="card-carousel">
                        {hotel.images && hotel.images.map((img, i) => (
                          <Carousel.Item key={i}>
                            <img 
                              src={`${img}?width=800&quality=70`}
                              className="hotels-page-card-img" 
                              alt={hotel.name}
                              effect="blur"
                              loading={index < 3 ? "eager" : "lazy"}
                            />
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
                <div className="pagination-container mt-5">
                  {/* Твой код кнопок пагинации (остается без изменений) */}
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
            </>
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
                <Accordion.Item eventKey={String(id)} key={id} className="border-0 shadow-sm rounded">
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


const HotelFilter = ({ hotels, setFilteredHotels }) => {
  const { t } = useTranslation();

  // Стейты для наших фильтров
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [visibleAmenities, setVisibleAmenities] = useState(5);

  // Динамически получаем уникальные города из базы
  const uniqueCities = [...new Set(hotels.map(h => h.city))].filter(Boolean);
  
  // Динамически получаем все возможные удобства (разбиваем строки через запятую)
  const allAmenities = hotels.reduce((acc, hotel) => {
    if (hotel.amenities) {
      const amenitiesList = hotel.amenities.split(',').map(a => a.trim());
      amenitiesList.forEach(a => {
        if (!acc.includes(a)) acc.push(a);
      });
    }
    return acc;
  }, []);

  // Главная логика фильтрации (срабатывает при любом изменении стейтов)
  useEffect(() => {
    let result = hotels;

    // Фильтр по названию
    if (searchTerm) {
      result = result.filter(h =>
        h.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Фильтр по городу
    if (selectedCity) {
      result = result.filter(h => h.city === selectedCity);
    }

    // Фильтр по рейтингу
    if (selectedRating) {
      result = result.filter(h => h.rating >= parseInt(selectedRating));
    }

    // Фильтр по удобствам (отель должен иметь ВСЕ выбранные чекбоксы)
    if (selectedAmenities.length > 0) {
      result = result.filter(h => {
        if (!h.amenities) return false;
        const hotelAmenities = h.amenities.split(',').map(a => a.trim());
        return selectedAmenities.every(a => hotelAmenities.includes(a));
      });
    }

    // Отправляем отфильтрованный список обратно в родительский компонент
    setFilteredHotels(result);
  }, [searchTerm, selectedCity, selectedRating, selectedAmenities, hotels, setFilteredHotels]);

  // Обработчик для чекбоксов удобств
  const handleAmenityChange = (amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity) // Если уже выбран - убираем
        : [...prev, amenity]              // Если нет - добавляем
    );
  };

  // Сброс всех фильтров
  const handleReset = () => {
    setSearchTerm('');
    setSelectedCity('');
    setSelectedRating('');
    setSelectedAmenities([]);
  };

  return (
    <Card className="hotels-filter-card mb-4 shadow-sm">
      <Card.Body>
        <Form>
          <Row>
            {/* Поиск по названию */}
            <Col lg={3} md={6} className="mb-3">
              <Form.Group controlId="filterName">
                <Form.Label className="hotels-filter-label">
                  {t('hotels_page.filter.search_name', 'Название')}
                </Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder={t('hotels_page.filter.search_placeholder', 'Искать отель...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="hotels-filter-input"
                />
              </Form.Group>
            </Col>

            {/* Фильтр по городу */}
            <Col lg={3} md={6} className="mb-3">
              <Form.Label className="hotels-filter-label">{t('hotels_page.filter.city', 'Город')}</Form.Label>
              <Dropdown onSelect={(val) => setSelectedCity(val)} className="hotels-custom-dropdown">
                <Dropdown.Toggle 
                className="hotels-filter-input w-100 text-start" 
                variant="none"
                autoClose="outside" // Меню будет закрываться только при клике вне его
                >

                  {selectedCity ? t(selectedCity, selectedCity) : t('hotels_page.filter.all_cities', 'Все города')}
                </Dropdown.Toggle>

                <Dropdown.Menu className="hotels-dropdown-menu w-100">
                  <Dropdown.Item eventKey="">{t('hotels_page.filter.all_cities', 'Все города')}</Dropdown.Item>
                  {uniqueCities.map(city => (
                    <Dropdown.Item key={city} eventKey={city}>
                      {t(city, city)}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Col>

            {/* Фильтр по рейтингу через Custom Dropdown */}
            <Col lg={3} md={6} className="mb-3">
              <Form.Label className="hotels-filter-label">
                {t('hotels_page.filter.rating', 'Рейтинг')}
              </Form.Label>
              <Dropdown onSelect={(val) => setSelectedRating(val)} className="hotels-custom-dropdown">
                <Dropdown.Toggle variant="none" className="hotels-filter-input w-100 text-start">
                  {selectedRating 
                    ? `${selectedRating}+ ${t('hotels_page.filter.stars', 'звезды')}` 
                    : t('hotels_page.filter.any_rating', 'Любой рейтинг')}
                </Dropdown.Toggle>

                <Dropdown.Menu className="hotels-dropdown-menu w-100">
                  <Dropdown.Item eventKey="">
                    {t('hotels_page.filter.any_rating', 'Любой рейтинг')}
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="3">3+ {t('hotels_page.filter.stars', 'звезды')}</Dropdown.Item>
                  <Dropdown.Item eventKey="4">4+ {t('hotels_page.filter.stars', 'звезды')}</Dropdown.Item>
                  <Dropdown.Item eventKey="5">5 {t('hotels_page.filter.stars', 'звезд')}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>

            {/* Кнопка сброса */}
            <Col lg={3} md={6} className="mb-3 d-flex align-items-end">
              <Button 
                variant="success" 
                className="w-100 hotels-filter-reset-btn" 
                onClick={handleReset}
              >
                {t('hotels_page.filter.reset_filters', 'Сбросить фильтры')}
              </Button>
            </Col>
          </Row>

          {/* Фильтр по удобствам */}
          <div className="mt-2 hotels-filter-amenities-wrapper">
            <Form.Label className="d-block hotels-filter-label mb-2">
              {t('hotels_page.filter.amenities', 'Удобства')}
            </Form.Label>
            <div className="hotels-amenities-container">
              <div className="d-flex flex-wrap gap-3">
                {(window.innerWidth < 768 ? allAmenities : allAmenities.slice(0, visibleAmenities)).map(amenity => (
                  <Form.Check 
                    key={amenity}
                    type="checkbox"
                    id={`amenity-${amenity}`}
                    label={t(`hotels_page.filter.amenities_list.${amenity.toLowerCase().replace(/ /g, '_')}`, amenity)}
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                    className="hotels-filter-amenity-checkbox"
                  />
                ))}
              </div>
            </div>

            {/* Show more / Show less */}
            <div className="mt-2">
              {visibleAmenities < allAmenities.length ? (
                <button
                  type="button"
                  className="amenities-toggle-btn"
                  onClick={() => setVisibleAmenities(prev => prev + 5)}
                >
                  {t('hotels_page.filter.show_more', 'Show more')}
                </button>
              ) : (
                allAmenities.length > 8 && (
                  <button
                    type="button"
                    className="amenities-toggle-btn"
                    onClick={() => setVisibleAmenities(5)}
                  >
                    {t('hotels_page.filter.show_less', 'Show less')}
                  </button>
                )
              )}
            </div>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default HotelsPage;