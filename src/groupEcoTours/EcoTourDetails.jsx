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
import data from './groupEcoToursData.json';
import './GroupEcoTours.css';

const EcoTourDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const tour = data.ecoTours.find(item => item.id === id);

  // Скролл вверх при загрузке страницы
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!tour) return <div className="text-center py-5">Tour not found</div>;

  return (
    <div className="eco-details-page">
      <NavbarCustom />

      {/* 1. HERO SECTION */}
      <div className="eco-hero" style={{ backgroundImage: `url(${tour.image})` }}>
        <div className="eco-hero-overlay">
          <Container>
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} /> {t('common.back', 'Назад')}
            </button>
            <div className="hero-content-box">
              <span className="eco-badge-top">
                <Leaf size={14} /> ECO MISSION
              </span>
              <h1>{t(`tours.${tour.id}.title`)}</h1>
              
              <div className="quick-stats">
                <div className="stat-item">
                  <Calendar size={18} />
                  <span>{tour.date}</span>
                </div>
                <div className="stat-item">
                  <MapPin size={18} />
                  <span>{tour.location}</span>
                </div>
                <div className="stat-item">
                  <Clock size={18} />
                  <span>{tour.duration || '1 Day'}</span>
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
                <h3>{t('eco.mission_title', 'Наша цель в этом туре')}</h3>
              </div>
              <p className="mission-text">{t(`tours.${tour.id}.mission`)}</p>
            </section>

            {/* Описание */}
            <section className="info-block">
              <h3>{t('eco.about_tour', 'О туре')}</h3>
              <p className="description-text">{t(`tours.${tour.id}.description`)}</p>
            </section>

            {/* Что включено (Minimalist List) */}
            <section className="info-block">
              <h3>{t('eco.whats_included', 'Что включено')}</h3>
              <div className="included-grid">
                <div className="inc-item"><CheckCircle2 size={18} /> {t('eco.inc_1', 'Трансфер')}</div>
                <div className="inc-item"><CheckCircle2 size={18} /> {t('eco.inc_2', 'Эко-ланч')}</div>
                <div className="inc-item"><CheckCircle2 size={18} /> {t('eco.inc_3', 'Инвентарь')}</div>
                <div className="inc-item"><CheckCircle2 size={18} /> {t('eco.inc_4', 'Гид')}</div>
              </div>
            </section>
          </Col>

          {/* ПРАВАЯ КОЛОНКА (Sticky Sidebar) */}
          <Col lg={4}>
            <div className="eco-booking-card">
              <div className="card-top">
                <span className="price-label">{t('eco.price_start', 'Стоимость участия')}</span>
                <h2 className="price-value">{tour.price}</h2>
              </div>
              
              <div className="card-features">
                <div className="feat-line">
                  <ShieldCheck size={16} /> 
                  <span>{t('eco.insurance', 'Страховка включена')}</span>
                </div>
                <div className="feat-line">
                  <Leaf size={16} /> 
                  <span>{t('eco.impact', 'Прямой вклад в природу')}</span>
                </div>
              </div>

              <button className="eco-main-btn">
                {t('buttons.join_mission', 'Присоединиться к миссии')}
              </button>
              
              <p className="guarantee-text">
                {t('eco.no_prepayment', 'Предоплата не требуется')}
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