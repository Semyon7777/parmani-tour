import React, { useEffect } from "react";
import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { 
  MapPin, ShieldCheck, Heart, Headphones, ArrowRight, Calendar, Clock
} from "lucide-react"; 

// Components
import FirstPageFirstPart from "./firstPageFirstPart";
import FirstPageSecondPart from "./firstPageSecondPart";
import FirstPageThirdPart from "./firstPageThirdPart";
import Footer from "../Components/Footer";

// CSS
import "./firstPage.css";

function HomePage() {
  useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div id="homePage">
      {/* 1. HERO & INTRO */}
      <FirstPageFirstPart />
      <FirstPageSecondPart />
      <FirstPageThirdPart />


      {/* 2. WHY CHOOSE US */}
      <TrustSection />

      {/* 3. UPCOMING EVENTS */}
      <UpcomingEventsSection />

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
  const { t } = useTranslation();

  // Имитация данных (потом можно вынести в JSON)
  const events = [
    {
      id: 1,
      date: "20 May, 2024",
      time: "09:00",
      title: "Wine Festival in Areni",
      type: "Group Tour",
      image: "/TourImages/areni-fest.jpg",
      price: "45$"
    },
    {
      id: 2,
      date: "22 May, 2024",
      time: "08:30",
      title: "Sevan Sunrise Yoga",
      type: "Eco Tour",
      image: "/TourImages/sevan-yoga.jpg",
      price: "30$"
    },
    {
      id: 3,
      date: "25 May, 2024",
      time: "10:00",
      title: "Dilijan Forest Hike",
      type: "Adventure",
      image: "/TourImages/dilijan-hike.jpg",
      price: "50$"
    }
  ];

  return (
    <section className="home-upcoming-section py-5">
      <Container>
        <div className="home-section-header d-flex justify-content-between align-items-end mb-5">
          <div>
            <div className="live-indicator mb-2">
              <span className="dot"></span>
              <span className="live-text">{t("home_page.upcoming.live_now", "БЛИЖАЙШИЕ СОБЫТИЯ")}</span>
            </div>
            <h2 className="home-section-title m-0">{t("home_page.upcoming.title", "Скоро в программе")}</h2>
          </div>
          <Button variant="link" href="/group-eco-tours" className="view-all-link text-success p-0 d-none d-md-block">
            {t("home_page.upcoming.view_all", "Смотреть все")} <ArrowRight size={18} />
          </Button>
        </div>

        <Row className="g-4">
          {events.map((event) => (
            <Col lg={4} md={6} key={event.id}>
              <div className="event-card shadow-sm">
                <div className="event-image-wrapper">
                  <div className="event-img" style={{ backgroundImage: `url(${event.image})` }}></div>
                  <Badge bg="light" className="event-date-badge text-dark">
                    <Calendar size={14} className="me-1" /> {event.date}
                  </Badge>
                </div>
                <div className="event-content p-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="event-type text-success small fw-bold">{event.type}</span>
                    <span className="event-time text-muted small"><Clock size={14} /> {event.time}</span>
                  </div>
                  <h4 className="event-title">{event.title}</h4>
                  <div className="event-footer d-flex justify-content-between align-items-center mt-4">
                    <div className="event-price">
                      <span className="from-text">{t("starting_from", "От")}</span>
                      <span className="price-value"> {event.price}</span>
                    </div>
                    <Button variant="outline-success" size="sm" className="rounded-pill px-3">
                      {t("join", "Участвовать")}
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default HomePage;