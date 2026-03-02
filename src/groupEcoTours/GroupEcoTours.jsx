import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Leaf, Users, Calendar, MapPin, ArrowRight, TreePine,
   ShieldCheck, Coffee, Heart, MessageCircle } from "lucide-react";
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
          <p>{t("group_eco_tours.hero_subtitle", "Choose your path: Save nature or Explore culture")}</p>
        </div>
      </div>

      {/* 2. TABS */}
      <Container className="tabs-container">
        <div className="custom-tabs">
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            {t("group_eco_tours.tab_all", "All Events")}
          </button>
          <button 
            className={`tab-btn group-tab ${activeTab === 'group' ? 'active' : ''}`}
            onClick={() => setActiveTab('group')}
          >
            <Users size={18} /> {t("group_eco_tours.tab_group", "Group Tours")}
          </button>
                    <button 
            className={`tab-btn eco-tab ${activeTab === 'eco' ? 'active' : ''}`}
            onClick={() => setActiveTab('eco')}
          >
            <Leaf size={18} /> {t("group_eco_tours.tab_eco", "Eco Missions")}
          </button>
        </div>
      </Container>

      <DynamicInfoSection activeTab={activeTab} currentLang={currentLang} />

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
                      {tour.type === 'eco' ? t("group_eco_tours.badge_eco", " Eco-Mission") : t("group_eco_tours.badge_group", " Group Tour")}
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
                        {t("group_eco_tours.only", "Only")} {tour.spots} {t("group_eco_tours.spots_left", "spots left")}
                      </span>
                    </div>

                    {tour.type === 'eco' && (
                      <div className="eco-impact-box">
                        <TreePine size={18} color="#2ecc71"/> 
                        {/* Миссия на текущем языке */}
                        <span>{t("group_eco_tours.mission", "Mission")}: {tour.impact[currentLang] || tour.impact['en']}</span>
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
                          <span>{t("group_eco_tours.btn_join", "Join Now")}</span>
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


const DynamicInfoSection = ({ activeTab, currentLang }) => {
  const { t } = useTranslation();

  // Если выбрано "Все", показываем общий блок о качестве
  if (activeTab === 'all') {
    return (
      <div className="dynamic-info-block all-info py-5">
        <Container>
          <Row className="text-center g-4">
            <Col md={4}>
              <div className="info-card-simple">
                <Heart size={32} color="#e74c3c" />
                <h5>{t("group_eco_tours.all_heart_title", "Made with Love")}</h5>
                <p className="small text-muted">{t("group_eco_tours.all_heart_text", "Each route is carefully planned by locals")}</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="info-card-simple">
                <ShieldCheck size={32} color="#3498db" />
                <h5>{t("group_eco_tours.all_safe_title", "Safety First")}</h5>
                <p className="small text-muted">{t("group_eco_tours.all_safe_text", "Professional drivers and certified guides")}</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="info-card-simple">
                <Users size={32} color="#f1c40f" />
                <h5>{t("group_eco_tours.all_comm_title", "Community")}</h5>
                <p className="small text-muted">{t("group_eco_tours.all_comm_text", "Join a group of like-minded travelers")}</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  // Данные для Эко-миссий
  if (activeTab === 'eco') {
    return (
      <div className="dynamic-info-block eco-info py-5" style={{ background: '#f1f8f4' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h2 className="fw-bold mb-3">{t("group_eco_tours.eco_mission_title", "Our Eco Impact")}</h2>
              <p>{t("group_eco_tours.eco_mission_desc", "We don't just travel; we take care of the mountains we love. Join our mission.")}</p>
            </Col>
            <Col lg={6}>
              <div className="d-flex gap-4 justify-content-center">
                <div className="stat-badge">
                  <TreePine size={30} />
                  <span>150+ {t("group_eco_tours.stats_trees", "Trees")}</span>
                </div>
                <div className="stat-badge">
                  <Leaf size={30} />
                  <span>500{t("group_eco_tours.stats_waste", "kg+ Waste")}</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  // Данные для Групповых туров
  if (activeTab === 'group') {
    return (
      <div className="dynamic-info-block group-info py-5" style={{ background: '#f0f4f8' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h2 className="fw-bold mb-3">{t("group_eco_tours.group_perks_title", "Group Travel Perks")}</h2>
              <p>{t("group_eco_tours.group_perks_desc", "Maximum comfort in small companies. We take care of everything.")}</p>
            </Col>
            <Col lg={6}>
              <div className="d-flex gap-4 justify-content-center">
                <div className="perk-badge">
                  <Users size={30} />
                  <span>{t("group_eco_tours.stats_people", "Max 20 People")}</span>
                </div>
                <div className="perk-badge">
                  <Coffee size={30} />
                  <span>{t("group_eco_tours.stats_inc", "All Inclusive")}</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return null;
};

const TourCTA = () => {
  const { t } = useTranslation();

  return (
    <div className="tour-cta-banner my-5">
      <Container className="text-center p-5 rounded-4 bg-dark text-white">
        <h2 className="mb-3">{t("tours.cta_title", "Didn't find a suitable date?")}</h2>
        <p className="mb-4 opacity-75">{t("tours.cta_text", "We can organize a private tour for your group on any day!")}</p>
        <a href="https://wa.me/yournumber" className="btn btn-success btn-lg rounded-pill px-4 d-inline-flex align-items-center gap-2">
          <MessageCircle size={20} />
          {t("tours.cta_btn", "Contact Us")}
        </a>
      </Container>
    </div>
  );
};

export default GroupEcoTours;