import React, { useEffect, useState, useRef, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { 
  MapPin, ShieldCheck, Heart, Headphones, Calendar, 
  Leaf, Users, ArrowRight} from "lucide-react"; 
import { useNavigate, Link } from "react-router-dom";
import FirstPageFirstPart from "./firstPageFirstPart";
import FirstPageSecondPart from "./firstPageSecondPart";
import FirstPageThirdPart from "./firstPageThirdPart";
import { supabase } from "../supabaseClient";
import Footer from "../Components/Footer";

// CSS
import "./firstPage.css";

function HomePage() {

  return (
    <div id="homePage">
      {/* 1. HERO & INTRO */}
      <FirstPageFirstPart />
      <FirstPageSecondPart />
      <FirstPageThirdPart />

      {/* 3. UPCOMING EVENTS */}
      <UpcomingEventsSection />

      {/* 2. WHY CHOOSE US */}
      <TrustSection />

      {/* 4. EXPLORE ARMENIA (Grid) */}
      <ExploreSection />

      <Footer />
    </div>
  );
}

// 3. Trust Section: Cleaned up
function TrustSection() {
  const { t } = useTranslation();

  const trustItems = [
    { key: "local_experts", icon: <MapPin size={32} />, color: "#3a7d44" },
    { key: "best_price", icon: <ShieldCheck size={32} />, color: "#2d4a31" },
    { key: "handpicked", icon: <Heart size={32} />, color: "#5e8c61" },
    { key: "support", icon: <Headphones size={32} />, color: "#1e4632" }
  ];

  return (
    <section className="home-trust-section">
      <Container>
        <div className="home-section-header"> 
          <h2 className="home-section-title">{t("home_page.why_choose_us.title")}</h2>
          <p className="home-section-subtitle">{t("home_page.why_choose_us.subtitle")}</p>
        </div>

        <Row className="g-4">
          {trustItems.map((item, index) => (
            <Col md={6} lg={3} key={index}>
              <div className="home-trust-card">
                <div className="icon-wrapper" style={{ color: item.color, borderColor: item.color }}>
                  {item.icon}
                </div>
                <h5>{t(`home_page.why_choose_us.items.${item.key}.title`)}</h5>
                <p>{t(`home_page.why_choose_us.items.${item.key}.text`)}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

// 4. Explore Section: Dynamic Mapping
function ExploreSection() {
  const { t } = useTranslation();
  
  // Define your places here. You can import images and set them as `img: yerevanImg`
  const places = ["yerevan", "sevan", "dilijan", "heritage"];

  return (
    <section className="home-explore-section">
      <Container>
        <div className="home-section-header text-center">
          <h2 className="home-section-title">{t("home_page.explore.title")}</h2>
          <p className="home-section-subtitle">{t("home_page.explore.subtitle")}</p>
        </div>

        <Row className="g-4">
          {places.map((place) => (
            <Col md={6} lg={3} key={place}>
              {/* Add style={{ backgroundImage: `url(${yourImageImport})` }} to the card div */}
              <div className={`home-explore-card explore-${place}`}>
                <div className="home-explore-overlay">
                  <h5>{t(`home_page.explore.items.${place}.title`)}</h5>
                  <span>{t(`home_page.explore.items.${place}.text`)}</span>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

// --- НОВЫЙ КОМПОНЕНТ: БЛИЖАЙШИЕ ТУРЫ ---

function UpcomingEventsSection() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Тот же кэш предзагрузки как в TourGrid
  const prefetchedTours = useRef({});

  useEffect(() => {
    const fetchUpcoming = async () => {
      const { data, error } = await supabase
        .from('group_eco_tours')
        .select('id, type, title, date, price, image, location, spots')
        .eq('is_active', true)
        .limit(3);

      if (!error) setEvents(data || []);
      setLoading(false);
    };
    fetchUpcoming();
  }, []);

  // Предзагрузка при наведении — точно как в TourGrid
  const handleMouseEnter = useCallback(async (tourId) => {
    if (prefetchedTours.current[tourId]) return;

    try {
      const { data } = await supabase
        .from('group_eco_tours')
        .select('*')
        .eq('id', tourId)
        .single();

      if (data) prefetchedTours.current[tourId] = data;
    } catch (err) {
      console.error("Prefetch error:", err);
    }
  }, []);

  // Клик — точно как в TourGrid
  const handleTourClick = async (e, event) => {
    e.preventDefault();

    try {
      let tourData = prefetchedTours.current[event.id];

      if (!tourData) {
        const { data, error } = await supabase
          .from('group_eco_tours')
          .select('id, type, title, date, price, image, location, spots')
          .eq('id', event.id)
          .single();
        if (error) throw error;
        tourData = data;
      }

      const path = event.type === "eco" ? `/eco-tour/${event.id}` : `/group-tour/${event.id}`;
      navigate(path, { state: { tour: tourData } });

    } catch (err) {
      console.error("Error:", err);
      navigate(event.type === "eco" ? `/eco-tour/${event.id}` : `/group-tour/${event.id}`);
    }
  };

  return (
    <section className="home-upcoming-section py-5">
      <Container>
        {/* ... заголовок без изменений ... */}
        <div className="home-section-header d-flex justify-content-between align-items-end mb-5">
          <div>
            <div className="live-indicator mb-2">
              <span className="dot"></span>
              <span className="live-text">{t("home_page.upcoming.live_now", "БЛИЖАЙШИЕ СОБЫТИЯ")}</span>
            </div>
            <h2 className="home-section-title home-coming-soon-title -m-0">{t("home_page.upcoming.title", "Скоро в программе")}</h2>
          </div>
          <Link to="/group-eco-tours" className="view-all-link text-success d-md-block">
            {t("home_page.upcoming.view_all")} <ArrowRight size={18} />
          </Link>
        </div>

        <Row className="g-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <Col lg={4} md={6} key={i}>
                <div className="event-card shadow-sm" style={{ height: 300, background: "#f0f0f0", borderRadius: 12 }} />
              </Col>
            ))
          ) : (
            events.map((event) => (
              <Col lg={4} md={6} key={event.id}>
                {/* onMouseEnter на карточку — предзагрузка при наведении */}
                <div
                  className="event-card shadow-sm"
                  onMouseEnter={() => handleMouseEnter(event.id)}
                >
                  <div className="event-image-wrapper">
                    <div className="event-img" style={{ backgroundImage: `url(${event.image})` }}></div>
                      <div className={`tour-type-badge ${event.type === "eco" ? "tour-type-badge-is-eco" : "tour-type-badge-is-group"}`}>
                        {event.type === "eco" ? <Leaf size={12} /> : <Users size={12} />}
                        <span>{event.type === "eco" ? t("group_eco_tours.badge_eco") : t("group_eco_tours.badge_group")}</span>
                      </div>
                  </div>
                  <div className="event-tour-body">
                    <div className="tour-date-top">
                      <Calendar size={14} />
                      <span>{event.date}</span>
                    </div>
                    <h3 className="tour-title-text">
                      {event.title?.[currentLang] || event.title?.en}
                    </h3>
                    <div className="tour-details">
                      <div className="detail-item">
                        <MapPin size={14} />
                        <span>{event.location?.[currentLang] || event.location?.en}</span>
                      </div>
                      <div className="detail-item spots">
                        <span className="spots-dot"></span>
                        {t("group_eco_tours.only")} {event.spots} {t("group_eco_tours.spots_left")}
                      </div>
                    </div>

                    <div className="tour-action-area">
                      <div className="tour-price-tag">{event.price} AMD</div>
                      <Link
                        to={event.type === "eco" ? `/eco-tour/${event.id}` : `/group-tour/${event.id}`}
                        onClick={(e) => handleTourClick(e, event)}
                        className="tour-btn-minimal"
                      >
                        {t("group_eco_tours.btn_join")}
                      </Link>
                    </div>
                  </div>
                </div>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </section>
  );
}

export default HomePage;