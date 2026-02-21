import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { 
  Users, Calendar, MapPin, ArrowLeft, 
  Clock, Bus, Utensils, Camera, Info
} from 'lucide-react';
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import data from './groupEcoToursData.json';
import './GroupEcoTours.css';

const GroupTourDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const tour = data.groupTours.find(item => item.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!tour) return <div className="text-center py-5">Tour not found</div>;

  return (
    <div className="group-details-page">
      <NavbarCustom />

      {/* 1. BOLD HERO SECTION */}
      <div className="group-hero" style={{ backgroundImage: `url(${tour.image})` }}>
        <div className="group-hero-overlay">
          <Container>
            <button className="group-back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
            </button>
            <div className="group-hero-label">
              <Badge className="group-type-badge bg-warning">{t('group.badge', 'GROUP ADVENTURE')}</Badge>
              <h1 className="group-title">{t(`tours.${tour.id}.title`)}</h1>
            </div>
          </Container>
        </div>
      </div>

      {/* 2. QUICK INFO STRIP (Быстрые факты) */}
      <div className="info-strip">
        <Container>
          <div className="strip-grid">
            <div className="strip-item">
              <Users size={20} />
              <div>
                <small>{t('group.size', 'Группа')}</small>
                <span>Up to 15 ppl</span>
              </div>
            </div>
            <div className="strip-item">
              <Bus size={20} />
              <div>
                <small>{t('group.transport', 'Транспорт')}</small>
                <span>Minivan</span>
              </div>
            </div>
            <div className="strip-item">
              <Clock size={20} />
              <div>
                <small>{t('group.duration', 'Длительность')}</small>
                <span>10 Hours</span>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="group-main-content">
        <Row className="gx-5">
          <Col lg={7}>
            {/* Программа тура (Timeline) */}
            <section className="itinerary-section">
              <h2 className="section-title">{t('group.program_label', 'Программа тура')}</h2>
              <div className="timeline">
                {/* Предположим, в JSON это массив или одна строка, которую мы разбиваем */}
                <div className="timeline-item">
                  <div className="time">09:00</div>
                  <div className="content">
                    <h4>{t('group.step_1_title', 'Departure')}</h4>
                    <p>{t('group.step_1_desc', 'Meeting at the Republic Square.')}</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="time">12:00</div>
                  <div className="content">
                    <h4>{t('group.step_2_title', 'Exploration')}</h4>
                    <p>{t(`tours.${tour.id}.itinerary`)}</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="time">15:00</div>
                  <div className="content">
                    <h4>{t('group.step_3_title', 'Lunch & Relax')}</h4>
                    <div className="timeline-icons">
                      <Utensils size={16} /> <Camera size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Важная информация */}
            <section className="important-info">
              <div className="info-card">
                <Info size={24} className="text-orange" />
                <div>
                  <h4>{t('group.to_bring', 'Что взять с собой?')}</h4>
                  <p>{t('group.bring_desc', 'Comfortable shoes, sunglasses, and your best mood.')}</p>
                </div>
              </div>
            </section>
          </Col>

          {/* Правая колонка - Бронирование */}
          <Col lg={5}>
            <div className="group-booking-panel">
              <div className="price-box">
                <div className="price-circle">
                  <span>{tour.price}</span>
                </div>
                <p className="per-person">{t('group.per_person', 'за человека')}</p>
              </div>

              <div className="booking-details">
                <div className="detail-row">
                  <Calendar size={18} />
                  <span>{tour.date}</span>
                </div>
                <div className="detail-row">
                  <MapPin size={18} />
                  <span>{tour.location}</span>
                </div>
              </div>

              <button className="group-action-btn">
                {t('buttons.book', 'Забронировать место')}
              </button>

              <div className="spots-counter">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '70%' }}></div>
                </div>
                <small>🔥 {t('group.limited', 'Осталось всего 5 мест!')}</small>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
};

export default GroupTourDetails;