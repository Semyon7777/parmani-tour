import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Badge, Spinner, Tabs, Tab } from 'react-bootstrap';
import { 
  Users, Calendar, MapPin, ArrowLeft, 
  Clock, Bus, Info, XCircle
} from 'lucide-react';
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import { supabase } from "../supabaseClient";
import GroupEcoToursBookForm from './GroupEcoToursBookForm';
import TourGallery from "../Components/TourGallery";
import './GroupEcoTours.css';

import SEO from "../Components/SEO";


const GroupTourDetails = () => {

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const tourFromState = location.state?.tour;
  const [tour, setTour] = useState(tourFromState || null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [loading, setLoading] = useState(!tourFromState);
  const currentLang = (i18n.language || 'en').split('-')[0];

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchTour = async () => {
      const CACHE_KEY = `tour_cache_${id}`;
      const cachedTour = localStorage.getItem(CACHE_KEY);
      
      // 1. Пытаемся взять из кэша, если в стейте нет полных данных
      if (!tourFromState && cachedTour) {
        const parsed = JSON.parse(cachedTour);
        // Кэш валиден 15 минут
        if (Date.now() - parsed.timestamp < 15 * 60 * 1000) {
          setTour(parsed.data);
          setLoading(false);
          return;
        }
      }

      // 2. Если в tourFromState уже есть itinerary, не тянем из БД лишний раз
      if (tourFromState?.itinerary) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('group_eco_tours')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setTour(data);
          // Сохраняем в кэш
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data,
            timestamp: Date.now()
          }));
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id, tourFromState]);

  // Утилита для перевода (мемоизирована для скорости)
  const getTranslation = useMemo(() => (field) => {
    if (!field) return '';
    return typeof field === 'object' ? (field[currentLang] || field['en'] || '') : field;
  }, [currentLang]);

  if (loading && !tour) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  if (!tour) return <div className="text-center py-5">{t('group_eco_tours.not_found', 'Tour not found')}</div>;


  return (
    <div className="group-details-page">
      <SEO
        title={tour.title[currentLang]}
        description={tour.description?.[currentLang]}
        image={`https://www.parmanitour.com${tour.imageUrl}`}
        url={`/private-tours/${id}`}
        lang={currentLang}
      />
      
      <NavbarCustom />

      {/* 1. BOLD HERO SECTION */}
      <div className="group-hero" style={{ backgroundImage: `url(${tour.image}?width=1200&quality=80)` }}>
        <div className="group-hero-overlay">
          <Container>
            <button className="group-back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
            </button>
            <div className="group-hero-label">
              <Badge className="group-type-badge bg-warning">
                {tour.type === 'eco' ? t('group_eco_tours.badge_eco') : t('group_eco_tours.group.badge', 'GROUP ADVENTURE')}
              </Badge>
              <h1 className="group-title">{getTranslation(tour.title)}</h1>
            </div>
          </Container>
        </div>
      </div>

      {/* 2. QUICK INFO STRIP */}
      <div className="info-strip">
        <Container>
          <div className="strip-grid">
            <StripItem icon={<Users size={20} />} label={t('group_eco_tours.group.size')} value={`${t('group_eco_tours.up_to')} ${tour.people} ${t('group_eco_tours.people')}`} />
            <StripItem icon={<Bus size={20} />} label={t('group_eco_tours.group.transport')} value={`${t("group_eco_tours." + getTranslation(tour.transport).toLowerCase())}`} />
            <StripItem icon={<Clock size={20} />} label={t('group_eco_tours.group.duration')} value={`${tour.duration} ${t('group_eco_tours.group.hours')}`} />
          </div>
        </Container>
      </div>

      <Container className="group-main-content">
        <Row className="gx-5">
          <Col lg={7}>

            <TourGallery
              images={tour.gallery || []}
              alt={getTranslation(tour.title)}
            />

            {/* Программа тура (Timeline) */}
            <section className="itinerary-section">
              <h2 className="section-title">{t('group_eco_tours.group.program_label', 'Tour Program')}</h2>
              <div className="timeline">
                {tour.itinerary?.map((step, index) => (
                  <div className="timeline-item" key={index}>
                    <div className="time">{step.time}</div>
                    <div className="content">
                      {/* Теперь заголовок берется из твоего JSON (garni-temple) */}
                      <h4>{getTranslation(step.title)}</h4>
                      <p>{getTranslation(step.text)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="important-info">
              <div className="info-card">
                <Info size={24} className="text-orange" />
                <div>
                  <h4>{t('group_eco_tours.group.to_bring', 'What to bring?')}</h4>
                  <p>{t('group_eco_tours.group.bring_desc', 'Comfortable shoes, sunglasses, and your best mood.')}</p>
                </div>
              </div>
            </section>
          </Col>

          {/* Правая колонка - Бронирование */}
          <Col lg={5}>
            <div className="group-booking-panel">
              <div className="price-box">
                <div className="price-circle">
                  <span>{tour.price} AMD</span>
                </div>
                <p className="per-person">{t('group_eco_tours.group.per_person', 'per person')}</p>
              </div>

              <div className="booking-details">
                <div className="detail-row">
                  <Calendar size={18} />
                  <span>{tour.date}</span>
                </div>
                <div className="detail-row">
                  <MapPin size={18} />
                  <span>{getTranslation(tour.location)}</span>
                </div>
              </div>

              <button 
                className="group-action-btn" 
                onClick={() => setBookingOpen(true)}
                disabled={tour.spots === 0}
                style={{ 
                  opacity: tour.spots === 0 ? 0.6 : 1, 
                  cursor: tour.spots === 0 ? 'not-allowed' : 'pointer' 
                }}
              >
                {tour.spots === 0 
                  ? t('group_eco_tours.group.no_spots', 'No spots left') 
                  : t('group_eco_tours.group.book', 'Book a spot')
                }
              </button>
              
              <div className="spots-counter">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${tour.people > 0 ? (tour.spots / tour.people) * 100 : 0}%`}}
                  ></div>
                </div>
                <small>🔥 {t('group_eco_tours.group.limited', { count: tour.spots })}</small>
              </div>
            </div>
          </Col>

          <Col xs={12}>
            {/* 7. УСЛОВИЯ БРОНИРОВАНИЯ И ОТМЕНЫ - Using Bootstrap Tabs */}
            <section className="booking-policies-section mt-5 mb-5">
              <h3 className="section-title mb-4">
                <Info className="me-2 text-success" /> {t('tour_info_page.booking_conditions')}
              </h3>
              
              <Tabs defaultActiveKey="booking" id="policy-tabs" className="custom-tabs flex-nowrap responsive-tabs">
                <Tab 
                  eventKey="booking" 
                  title={<span><Calendar size={18} className="me-2" /> {t('tour_info_page.booking_process')}</span>}
                >
                  <div className="p-4 rounded-bottom border border-top-0 bg-light">
                    <p className="text-muted mb-0">
                      {t('tour_info_page.booking_text', 'Бронирование подтверждается мгновенно. Оплата производится наличными гиду или картой в день тура.')}
                    </p>
                  </div>
                </Tab>
                <Tab 
                  eventKey="cancellation" 
                  title={<span><XCircle size={18} className="me-2" /> {t('tour_info_page.cancellation_policy')}</span>}
                >
                  <div className="p-4 rounded-bottom border border-top-0 bg-light">
                    <p className="text-muted mb-0">
                      {t('tour_info_page.cancel_text', 'Бесплатная отмена за 24 часа. При отмене менее чем за сутки удерживается 20% стоимости.')}
                    </p>
                  </div>
                </Tab>
              </Tabs>
            </section>

            {/* БЛОК: РЕКОМЕНДАЦИИ - Horizontal scroll on Mobile */}
            
          </Col>

        </Row>
      </Container>

      <GroupEcoToursBookForm
        tour={tour}
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />

      <Footer />
    </div>
  );
};

// Вынос мелких компонентов ускоряет рендер
const StripItem = ({ icon, label, value }) => (
  <div className="strip-item">
    {icon}
    <div>
      <small>{label}</small>
      <span>{value}</span>
    </div>
  </div>
);

export default GroupTourDetails;