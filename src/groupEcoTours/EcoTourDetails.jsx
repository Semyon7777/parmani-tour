import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col } from 'react-bootstrap';
import { 
  Leaf, Calendar, MapPin, ArrowLeft, 
  CheckCircle2, Clock, ShieldCheck, TreePine 
} from 'lucide-react';
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import GroupEcoToursData from './groupEcoToursData.json';
import './GroupEcoTours.css';

const EcoTourDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLang = i18n.language || 'en';

  // Ищем во всех массивах данных
  const allTours = [...(GroupEcoToursData.ecoTours || []), ...(GroupEcoToursData.groupTours || [])];
  const tour = allTours.find(item => item.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!tour) return <div className="text-center py-5">Tour not found</div>;

  // Функция для безопасного получения перевода
  const getTranslation = (field) => {
    if (!field) return '';
    return field[currentLang] || field['en'] || '';
  };

  return (
    <div className="eco-details-page">
      <NavbarCustom />

      {/* 1. HERO SECTION */}
      <div className="eco-hero" style={{ backgroundImage: `url(${tour.image})` }}>
        <div className="eco-hero-overlay">
          <Container>
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} /> {t('common.back', 'Back')}
            </button>
            <div className="hero-content-box">
              <span className="eco-badge-top">
                <Leaf size={14} /> {t('tours.badge_eco', 'ECO MISSION')}
              </span>
              <h1>{getTranslation(tour.title)}</h1>
              
              <div className="quick-stats">
                <div className="stat-item">
                  <Calendar size={18} />
                  <span>{tour.date}</span>
                </div>
                <div className="stat-item">
                  <MapPin size={18} />
                  <span>{getTranslation(tour.location)}</span>
                </div>
                <div className="stat-item">
                  <Clock size={18} />
                  <span>{getTranslation(tour.duration)}</span>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>

      <Container className="eco-content-container">
        <Row className="gx-5">
          {/* ЛЕВАЯ КОЛОНКА */}
          <Col lg={8}>
            {/* Блок Миссии */}
            <section className="info-block mission-highlight">
              <div className="block-header">
                <TreePine className="icon-green" />
                <h3>{t('eco.mission_title', 'Our Mission in this tour')}</h3>
              </div>
              <p className="mission-text">{getTranslation(tour.mission)}</p>
            </section>

            {/* Описание */}
            <section className="info-block">
              <h3>{t('eco.about_tour', 'About the tour')}</h3>
              <p className="description-text">{getTranslation(tour.description)}</p>
            </section>

            {/* Что включено */}
            <section className="info-block">
              <h3>{t('eco.whats_included', 'What is included')}</h3>
              <div className="included-grid">
                <div className="inc-item"><CheckCircle2 size={18} /> {t('eco.inc_1', 'Transfer')}</div>
                <div className="inc-item"><CheckCircle2 size={18} /> {t('eco.inc_2', 'Eco-lunch')}</div>
                <div className="inc-item"><CheckCircle2 size={18} /> {t('eco.inc_3', 'Equipment')}</div>
                <div className="inc-item"><CheckCircle2 size={18} /> {t('eco.inc_4', 'Guide')}</div>
              </div>
            </section>
          </Col>

          {/* ПРАВАЯ КОЛОНКА */}
          <Col lg={4}>
            <div className="eco-booking-card">
              <div className="card-top">
                <span className="price-label">{t('eco.price_start', 'Participation fee')}</span>
                <h2 className="price-value">{tour.price}</h2>
              </div>
              
              <div className="card-features">
                <div className="feat-line">
                  <ShieldCheck size={16} /> 
                  <span>{t('eco.insurance', 'Insurance included')}</span>
                </div>
                <div className="feat-line">
                  <Leaf size={16} /> 
                  <span>{t('eco.impact', 'Direct environmental impact')}</span>
                </div>
              </div>

              <button className="eco-main-btn">
                {t('buttons.join_mission', 'Join the Mission')}
              </button>
              
              <p className="guarantee-text">
                {t('eco.no_prepayment', 'No prepayment required')}
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
};

export default EcoTourDetails;