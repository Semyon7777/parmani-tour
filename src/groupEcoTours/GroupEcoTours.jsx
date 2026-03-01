import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Leaf, Users, Calendar, MapPin, ArrowRight, TreePine } from "lucide-react";
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import GroupEcoToursData from "./groupEcoToursData.json";
import "./GroupEcoTours.css";

function GroupEcoTours() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  
  // Определяем текущий язык (например, 'en', 'ru' или 'am')
  const currentLang = i18n.language || 'en';

  // Объединяем туры из JSON
  const allTours = [...GroupEcoToursData.ecoTours, ...GroupEcoToursData.groupTours];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Фильтрация по типу
  const filteredTours = activeTab === "all" 
    ? allTours 
    : allTours.filter(tour => tour.type === activeTab);

  return (
    <div className="scheduled-page">
      <NavbarCustom />
      
      {/* 1. HERO SECTION */}
      <div className="scheduled-hero">
        <div className="hero-content text-center">
          {/* Заголовок страницы из JSON с учетом языка */}
          <h1 className="hero-main-title">
            {GroupEcoToursData.title?.[currentLang] || GroupEcoToursData.title?.['en']}
          </h1>
          <p>{t("tours.hero_subtitle", "Choose your path: Save nature or Explore culture")}</p>
        </div>
      </div>

      {/* 2. TABS */}
      <Container className="tabs-container">
        <div className="custom-tabs">
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            {t("tours.tab_all", "All Events")}
          </button>
          <button 
            className={`tab-btn group-tab ${activeTab === 'group' ? 'active' : ''}`}
            onClick={() => setActiveTab('group')}
          >
            <Users size={18} /> {t("tours.tab_group", "Group Tours")}
          </button>
                    <button 
            className={`tab-btn eco-tab ${activeTab === 'eco' ? 'active' : ''}`}
            onClick={() => setActiveTab('eco')}
          >
            <Leaf size={18} /> {t("tours.tab_eco", "Eco Missions")}
          </button>
        </div>
      </Container>

      {/* 3. TOURS GRID */}
      <section className="tours-list-section">
        <Container>
          <Row>
            {filteredTours.map((tour) => (
              <Col md={6} lg={4} key={tour.id} className="mb-4">
                <div className={`tour-card ${tour.type === 'eco' ? 'card-eco' : 'card-group'}`}>
                  
                  <div className="tour-img-wrapper">
                    <img src={tour.image} alt={tour.title[currentLang]} />
                    <div className="tour-badge">
                      {tour.type === 'eco' ? <Leaf size={14}/> : <Users size={14}/>}
                      {tour.type === 'eco' ? t("tours.badge_eco", " Eco-Mission") : t("tours.badge_group", " Group Tour")}
                    </div>
                  </div>

                  <div className="tour-content">
                    <div className="tour-date">
                      <Calendar size={16} /> {tour.date}
                    </div>
                    
                    {/* Название тура на текущем языке */}
                    <h3>{tour.title[currentLang] || tour.title['en']}</h3>
                    
                    <div className="tour-meta">
                      {/* Локация на текущем языке */}
                      <span><MapPin size={16}/> {tour.location[currentLang] || tour.location['en']}</span>
                      <span className="spots-left">
                        {t("tours.only", "Only")} {tour.spots} {t("tours.spots_left", "spots left")}
                      </span>
                    </div>

                    {tour.type === 'eco' && (
                      <div className="eco-impact-box">
                        <TreePine size={18} color="#2ecc71"/> 
                        {/* Миссия на текущем языке */}
                        <span>{t("tours.mission", "Mission")}: {tour.impact[currentLang] || tour.impact['en']}</span>
                      </div>
                    )}

                    <div className="tour-footer">
                      <div className="price">
                        {tour.price}
                      </div>
                      
                      <Link 
                        to={tour.type === 'eco' ? `/eco-tour/${tour.id}` : `/group-tour/${tour.id}`} 
                        className="join-link"
                      >
                        <button className="join-btn">
                          <span>{t("tours.btn_join", "Join Now")}</span>
                          <ArrowRight size={18} />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      
      <Footer />
    </div>
  );
}

export default GroupEcoTours;