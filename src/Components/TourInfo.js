import React, { useState } from 'react';
import { Button, Container, Row, Col, ListGroup, Image } from 'react-bootstrap';
import { 
  CheckCircle, XCircle, Clock, MapPin, Users, 
  Calendar, ArrowLeft, Map as MapIcon, ChevronDown, ChevronUp, Info 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import "./TourInfo.css";

const TourInfo = ({ tourData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Состояние для раскрытия секций "Read More"
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  return (
    <div className="tour-details-wrapper">
      {/* 1. ГЕРОЙ-БАННЕР */}
      <div className="tour-hero-section" style={{ backgroundImage: `url(${tourData.image})` }}>
        <div className="tour-hero-overlay">
          <Container>
            <button className="tour-back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
              <span>{t('tour_info_page.back_button')}</span>
            </button>
            <h1 className="tour-main-title">{tourData.title}</h1>
          </Container>
        </div>
      </div>

      <Container className="tour-content-container py-5">
        <Row>
          <Col lg={8}>
            {/* 2. КРАТКИЕ ФАКТЫ */}
            <div className="tour-quick-stats mb-5">
              <div className="stat-item">
                <Clock size={22} />
                <div>
                  <span className="stat-label">{t('tour_info_page.duration')}</span>
                  <span className="stat-value">8-10 {t('tour_info_page.hours')}</span>
                </div>
              </div>
              <div className="stat-item">
                <Users size={22} />
                <div>
                  <span className="stat-label">{t('tour_info_page.group_size')}</span>
                  <span className="stat-value">{t('tour_info_page.up_to')} 6 {t('tour_info_page.people')}</span>
                </div>
              </div>
              <div className="stat-item">
                <MapPin size={22} />
                <div>
                  <span className="stat-label">{t('tour_info_page.location')}</span>
                  <span className="stat-value">Armenia</span>
                </div>
              </div>
            </div>

            {/* 3. КАРТА И ТАЙМЛАЙН МАРШРУТА */}
            <section className="route-visual-section mb-5">
              <h3 className="section-title mb-4">
                <MapIcon className="me-2 text-success" /> {t('tour_info_page.route_overview')}
              </h3>
              <div className="route-card p-4 shadow-sm bg-white rounded-4 border">
                <Row className="align-items-center">
                  <Col md={6} className="mb-4 mb-md-0">
                    <div className="map-wrapper">
                      <Image 
                        src={tourData.routeMap || tourData.image} 
                        fluid 
                        className="rounded-3 shadow-sm"
                        alt="Route Map"
                      />
                      <div className="map-badge">{t('tour_info_page.view_route')}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="simple-timeline">
                      {tourData.sections.map((step, idx) => (
                        <div key={idx} className="timeline-step">
                          <div className="step-dot"></div>
                          <div className="step-info">
                            <span className="step-title">{step.header}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Col>
                </Row>
              </div>
            </section>

            {/* 4. ПОДРОБНАЯ ПРОГРАММА (READ MORE) */}
            <section className="itinerary-details-section mb-5">
              <h3 className="section-title mb-4">{t('tour_info_page.itinerary')}</h3>
              <div className="custom-itinerary-list">
                {tourData.sections.map((section, index) => {
                  const isExpanded = expandedSection === index;
                  return (
                    <div key={index} className={`itinerary-item ${isExpanded ? 'active' : ''}`}>
                      <div className="itinerary-trigger" onClick={() => toggleSection(index)}>
                        <div className="trigger-left">
                          <span className="itinerary-number">{index + 1}</span>
                          <h5>{section.header}</h5>
                        </div>
                        <div className="trigger-right">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>
                      
                      <div className={`itinerary-collapse ${isExpanded ? 'open' : ''}`}>
                        <div className="itinerary-content p-4">
                          <Row>
                            <Col md={section.image ? 7 : 12}>
                              <p className="itinerary-text">{section.content}</p>
                              {/* Если в JSON есть fullContent, выводим его здесь */}
                              {section.fullContent && <p className="itinerary-text mt-2">{section.fullContent}</p>}
                            </Col>
                            {section.image && (
                              <Col md={5}>
                                <Image src={section.image} fluid className="rounded-3 shadow-sm border" alt={section.header} />
                              </Col>
                            )}
                          </Row>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 5. ВКЛЮЧЕНО / НЕ ВКЛЮЧЕНО */}
            <section className="inclusions-section bg-white p-4 rounded-4 shadow-sm border">
              <h3 className="section-title mb-4">{t('tour_info_page.whats_included')}</h3>
              <Row>
                {tourData.include.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <Col md={6} className="mb-3 mb-md-0">
                      <ListGroup variant="flush">
                        {item.featuresInclude.map((feat, i) => (
                          <ListGroup.Item key={i} className="border-0 px-0 d-flex align-items-start">
                            <CheckCircle size={18} className="text-success me-2 mt-1 flex-shrink-0" />
                            <span className="small">{feat}</span>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Col>
                    <Col md={6}>
                      <ListGroup variant="flush">
                        {item.featuresNotInclude.map((feat, i) => (
                          <ListGroup.Item key={i} className="border-0 px-0 d-flex align-items-start text-muted">
                            <XCircle size={18} className="text-danger me-2 mt-1 flex-shrink-0" />
                            <span className="small">{feat}</span>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Col>
                  </React.Fragment>
                ))}
              </Row>
            </section>
          </Col>

          {/* 6. ПРАВАЯ КОЛОНКА: STICKY BOOKING CARD */}
          <Col lg={4}>
            <div className="sticky-booking-card p-4 shadow-lg border-0">
              <div className="booking-card-header mb-4">
                <span className="price-label">{t('tour_info_page.starting_from')}</span>
                <h2 className="booking-price">{tourData.price || '100$'}</h2>
              </div>
              
              <div className="booking-features-list mb-4">
                <div className="b-feature"><Calendar size={18} className="text-success" /> {t('tour_info_page.daily_tours')}</div>
                <div className="b-feature"><CheckCircle size={18} className="text-success" /> {t('tour_info_page.free_cancel')}</div>
                <div className="b-feature"><Users size={18} className="text-success" /> {t('tour_info_page.instant_confirm')}</div>
              </div>

              <Button 
                variant="success" 
                className="w-100 py-3 fw-bold booking-main-btn mb-3"
                onClick={() => navigate(`/tours/booking/${tourData.id}`)}
              >
                {t('tour_info_page.tour_book_button')}
              </Button>

              <div className="text-center">
                <p className="text-muted small mb-0">
                  <Info size={14} className="me-1" /> {t('tour_info_page.no_prepayment')}
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TourInfo;