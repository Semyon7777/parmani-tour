import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { 
  Leaf, Calendar, MapPin, ArrowLeft, Info,
  CheckCircle2, Clock, ShieldCheck, TreePine 
} from 'lucide-react';
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import { supabase } from "../supabaseClient";
import FaviconSpinner from "../Components/FaviconSpinner";
import './GroupEcoTours.css';

const EcoTourDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const tourFromState = location.state?.tour;
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [tour, setTour] = useState(tourFromState || null);
  const navigate = useNavigate();
  const currentLang = i18n.language || 'en';


  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchTour = async () => {
      setLoading(true);

      if (tourFromState) {
        // Показываем базовые данные сразу
        setTour(tourFromState);

        // Догружаем недостающие поля, например extra_details и description
        const { data, error } = await supabase
          .from('group_eco_tours')
          .select('extra_details, description') // только недостающие поля
          .eq('id', id)
          .maybeSingle(); // <-- изменено

        if (error) console.error(error);
        else if (data) setTour(prev => ({ ...prev, ...data })); // сливаем с существующим tour

      } else {
        // Если state нет, запрашиваем все данные сразу
        const { data, error } = await supabase
          .from('group_eco_tours')
          .select('*') // можно указать только нужные поля
          .eq('id', id)
          .maybeSingle(); // <-- изменено

        if (error) console.error(error);
        else if (!data) setTour(null); // тур не найден
        else setTour(data);
      }

      setLoading(false);
    };

    fetchTour();
  }, [id, tourFromState]);


  if (!tour) return <div className="text-center py-5">Tour not found</div>;

  // Функция для безопасного получения перевода
  const getTranslation = (field) => {
    if (!field) return '';
    // Проверяем: это объект с переводами (типа {en: '...', ru: '...'})?
    if (typeof field === 'object' && !Array.isArray(field)) {
      return field[currentLang] || field['en'] || '';
    }
    return field; // Если это просто строка
  };

  return (
    <div className="eco-details-page">
      <NavbarCustom />

      {/* 1. Этот компонент работает ВСЕГДА, пока есть loading */}
      <FaviconSpinner loading={loading} />

      {/* 3. Условный рендеринг контента */}
      {loading ? (
        // Визуальная заглушка на 0.5 сек (пока крутится иконка в табе)
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           {/* Можно оставить пустым или добавить легкий текст */}
        </div>
      ) : (<>

      {/* 1. HERO SECTION */}
      <div className="eco-hero" style={{ backgroundImage: `url(${tour.image})` }}>
        <div className="eco-hero-overlay">
          <Container>
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} /> {t('group_eco_tours.common.back', 'Back')}
            </button>
            <div className="hero-content-box">
              <span className="eco-badge-top">
                <Leaf size={14} /> {t('group_eco_tours.tours.badge_eco', 'ECO MISSION')}
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
                  {/* Используем напрямую число из базы */}
                  <span>{tour.duration} {t('group_eco_tours.common.hours', 'hours')}</span>
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
                  <h3>{t('group_eco_tours.eco.mission_title')}</h3>
                </div>
                {/* Добавили доступ через extra_details */}
                <p className="mission-text">{getTranslation(tour.extra_details?.mission)}</p>
              </section>

            {/* Описание */}
            <section className="info-block">
              <h3>{t('group_eco_tours.eco.about_tour', 'About the tour')}</h3>
              <p className="description-text">{getTranslation(tour.description)}</p>
            </section>

            {/* Что включено */}
            <section className="info-block">
              <h3>{t('group_eco_tours.eco.whats_included')}</h3>
              <div className="included-grid">
                {tour.extra_details?.included && tour.extra_details.included.map((item, index) => (
                  <div className="inc-item" key={index}>
                    <CheckCircle2 size={18} /> 
                    {/* Используем i18n для перевода коротких ключей (Transfer, Eco-lunch) */}
                    <span>{t(`group_eco_tours.included_items.${item}`, item)}</span>
                  </div>
                ))}
              </div>
            </section>
          </Col>

          {/* ПРАВАЯ КОЛОНКА */}
          <Col lg={4}>
            <div className="eco-booking-card">
              <div className="card-top">
                <span className="price-label">{t('group_eco_tours.eco.price_start')}</span>
                <h2 className="price-value">{tour.price}</h2>
              </div>
              
              <div className="card-features">
                <div className="feat-line">
                  <ShieldCheck size={16} /> 
                  <span>{t('group_eco_tours.eco.insurance')}</span>
                </div>
                <div className="feat-line">
                  <Leaf size={16} /> 
                  <span>{t('group_eco_tours.eco.impact')}</span>
                </div>
              </div>

              <button className="eco-main-btn">
                {t('group_eco_tours.buttons.join_mission')}
              </button>

              {/* ПРОГРЕСС-БАР И СЧЕТЧИК МЕСТ */}
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
                      width: `${tour.people > 0 ? ((tour.people - tour.spots) / tour.people) * 100 : 0}%` 
                    }}
                  ></div>
                </div>

                <div className="eco-spots-notice-simple">
                  <Info size={16} className="me-2" />
                  {t('group_eco_tours.eco.hurry_up', 'Join others in this mission')}
                </div>
              </div>
              
              <p className="guarantee-text">
                {t('group_eco_tours.eco.no_prepayment')}
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      </>)}

      <Footer />
    </div>
  );
};

export default EcoTourDetails;