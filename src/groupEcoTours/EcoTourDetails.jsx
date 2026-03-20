import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { 
  Leaf, Calendar, MapPin, ArrowLeft, Info,
  CheckCircle2, Clock, ShieldCheck, TreePine 
} from 'lucide-react';
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import { supabase } from "../supabaseClient";
import './GroupEcoTours.css';

const EcoTourDetails = () => {
const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const tourFromState = location.state?.tour;
  const [tour, setTour] = useState(tourFromState || null);
  // Если данные пришли из state, нам не нужно показывать экран загрузки
  const [loading, setLoading] = useState(!tourFromState);
  const currentLang = i18n.language || 'en';

useEffect(() => {
  window.scrollTo(0, 0);

    const fetchTourDetails = async () => {
      const CACHE_KEY = `eco_tour_${id}`;
      const cachedData = sessionStorage.getItem(CACHE_KEY);

      // 1. Пытаемся взять данные из кэша или state
      if (!tourFromState && cachedData) {
        const parsed = JSON.parse(cachedData);
        setTour(parsed);
        // Если в кэше уже полные данные, выходим
        if (parsed.description && parsed.extra_details) {
          setLoading(false);
          return;
        }
      }

      // 2. Проверяем, есть ли полные данные в текущем состоянии (state)
      // if (tour?.description && tour?.extra_details) {
      //   setLoading(false);
      //   return;
      // }

      // ПРАВИЛЬНО:
      if (tourFromState?.description && tourFromState?.extra_details) {
        setLoading(false);
        return;
      }

      // 3. Если данных не хватает — идем в базу
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('group_eco_tours')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setTour(data);
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
        }
      } catch (err) {
        console.error("Error fetching eco tour:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTourDetails();
  // Мы сознательно не добавляем tour в зависимости, чтобы избежать бесконечного цикла
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, tourFromState]);

  // Мемоизируем функцию перевода
  const getTranslation = useMemo(() => (field) => {
    if (!field) return '';
    if (typeof field === 'object' && !Array.isArray(field)) {
      return field[currentLang] || field['en'] || '';
    }
    return field;
  }, [currentLang]);

  if (loading && !tour) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="grow" variant="success" />
      </div>
    );
  }

  if (!tour) return <div className="text-center py-5">{t('group_eco_tours.not_found')}</div>;

  return (
    <div className="eco-details-page">
      <NavbarCustom />

      {/* 1. HERO SECTION */}
      <div className="eco-hero" style={{ backgroundImage: `url(${tour.image}?auto=format&fit=crop&w=1600&q=75)` }}>
        <div className="eco-hero-overlay">
          <Container>
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} /> {t('group_eco_tours.common.back')}
            </button>
            <div className="hero-content-box">
              <span className="eco-badge-top">
                <Leaf size={14} /> {t('group_eco_tours.tours.badge_eco')}
              </span>
              <h1>{getTranslation(tour.title)}</h1>
              
              <div className="quick-stats">
                <StatItem icon={<Calendar size={18} />} text={tour.date} />
                <StatItem icon={<MapPin size={18} />} text={getTranslation(tour.location)} />
                <StatItem icon={<Clock size={18} />} text={`${tour.duration} ${t('group_eco_tours.common.hours')}`} />
              </div>
            </div>
          </Container>
        </div>
      </div>

      <Container className="eco-content-container">
        <Row className="gx-5">
          <Col lg={8}>
            <section className="info-block mission-highlight">
              <div className="block-header">
                <TreePine className="icon-green" />
                <h3>{t('group_eco_tours.eco.mission_title')}</h3>
              </div>
              <p className="mission-text">{getTranslation(tour.extra_details?.mission)}</p>
            </section>

            <section className="info-block">
              <h3>{t('group_eco_tours.eco.about_tour')}</h3>
              <p className="description-text">{getTranslation(tour.description)}</p>
            </section>

            <section className="info-block">
              <h3>{t('group_eco_tours.eco.whats_included')}</h3>
              <div className="included-grid">
                {tour.extra_details?.included?.map((item, index) => (
                  <div className="inc-item" key={index}>
                    <CheckCircle2 size={18} /> 
                    <span>{t(`group_eco_tours.included_items.${item}`, item)}</span>
                  </div>
                ))}
              </div>
            </section>
          </Col>

          <Col lg={4}>
            {/* Делаем карточку липкой при скролле */}
            <div className="eco-booking-card sticky-top" style={{ top: '100px', zIndex: 10 }}>
              <div className="card-top">
                <span className="price-label">{t('group_eco_tours.eco.price_start')}</span>
                <h2 className="price-value">{tour.price}</h2>
              </div>
              
              <div className="card-features">
                <FeatureLine icon={<ShieldCheck size={16} />} text={t('group_eco_tours.eco.insurance')} />
                <FeatureLine icon={<Leaf size={16} />} text={t('group_eco_tours.eco.impact')} />
              </div>

              <button className="eco-main-btn">
                {t('group_eco_tours.buttons.join_mission')}
              </button>

              <div className="eco-spots-wrapper mt-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="spots-left-text">
                    {t('group_eco_tours.eco.limited_spots', { count: tour.spots })}
                  </span>
                </div>
                
                <div className="eco-progress-container">
                  <div 
                    className="eco-progress-fill" 
                    style={{ 
                      width: `${tour.people > 0 ? (tour.spots / tour.people) * 100 : 0}%` 
                    }}
                  ></div>
                </div>

                <div className="eco-spots-notice-simple">
                  <Info size={16} className="me-2" />
                  {t('group_eco_tours.eco.hurry_up')}
                </div>
              </div>
              
              <p className="guarantee-text">{t('group_eco_tours.eco.no_prepayment')}</p>
            </div>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
};

// Мелкие компоненты для чистоты и скорости
const StatItem = ({ icon, text }) => (
  <div className="stat-item">
    {icon} <span>{text}</span>
  </div>
);

const FeatureLine = ({ icon, text }) => (
  <div className="feat-line">
    {icon} <span>{text}</span>
  </div>
);

export default EcoTourDetails;