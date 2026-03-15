import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { 
  Users, Calendar, MapPin, ArrowLeft, 
  Clock, Bus, Info
} from 'lucide-react';
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import { supabase } from "../supabaseClient";
import './GroupEcoTours.css';

const GroupTourDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const tourFromState = location.state?.tour;
  const { t, i18n } = useTranslation();
  const [tour, setTour] = useState(tourFromState || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentLang = i18n.language || 'en';


  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchTour = async () => {
      setLoading(true);

      if (tourFromState) {
        setTour(tourFromState);

        const { data, error } = await supabase
          .from('group_eco_tours')
          .select('extra_details, itinerary')
          .eq('id', id)
          .maybeSingle();

        if (error) console.error(error);
        else if (data) setTour(prev => ({ ...prev, ...data }));

      } else {
        const { data, error } = await supabase
          .from('group_eco_tours')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) console.error(error);
        else if (!data) setTour(null);
        else setTour(data);
      }

      setLoading(false);
    };

    fetchTour();
  }, [id, tourFromState]);

  if (!tour) return <div className="text-center py-5">Tour not found</div>;

  // Удобная функция перевода, учитывающая вложенность
  const getTranslation = (field) => {
    if (!field) return '';
    return typeof field === 'object' ? (field[currentLang] || field['en'] || '') : field;
  };
  


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
            <div className="strip-item">
              <Users size={20} />
              <div>
                <small>{t('group_eco_tours.group.size', 'Group')}</small>
                <span>{t('group_eco_tours.up_to')} {tour.people} {t('group_eco_tours.people')}</span>
              </div>
            </div>
            <div className="strip-item">
              <Bus size={20} />
              <div>
                <small>{t('group_eco_tours.group.transport', 'Transport')}</small>
                <span>{getTranslation(tour.transport)}</span>
              </div>
            </div>
            <div className="strip-item">
              <Clock size={20} />
              <div>
                <small>{t('group_eco_tours.group.duration', 'Duration')}</small>
                <span>{tour.duration} {t('group_eco_tours.group.hours')}</span>
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
                  <span>{tour.price}</span>
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

              <button className="group-action-btn">
                {t('group_eco_tours.group.book', 'Book a spot')}
              </button>
              <div className="spots-counter">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(1 - (tour.spots / tour.people)) * 100}%` }}
                  ></div>
                </div>
                <small>🔥 {t('group_eco_tours.group.limited', { count: tour.spots })}</small>
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