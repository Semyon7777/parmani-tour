import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Leaf, Users, Calendar, MapPin, ArrowRight, TreePine,
   ShieldCheck, Coffee, HeartHandshake, MessageCircle } from "lucide-react";
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


      <GroupBenefits />

      <TourCTA />

      
      <Footer />
    </div>
  );
}


const ImpactStats = () => {
  const { t } = useTranslation();

  const stats = [
    { icon: <TreePine size={32} />, value: "120+", label: t("tours.stats_trees", "Trees Planted") },
    { icon: <Leaf size={32} />, value: "450kg", label: t("tours.stats_waste", "Waste Collected") },
    { icon: <Users size={32} />, value: "300+", label: t("tours.stats_volunteers", "Volunteers") },
  ];

  return (
    <div className="impact-stats-wrapper my-5">
      <Container>
        <Row className="justify-content-center text-center">
          {stats.map((stat, idx) => (
            <Col key={idx} xs={12} md={4} className="mb-4 mb-md-0">
              <div className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-label text-muted">{stat.label}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};


const GroupBenefits = () => {
  const { t } = useTranslation();

  const benefits = [
    {
      icon: <ShieldCheck size={30} />,
      title: t("tours.benefit_safe_title", "Small Groups"),
      text: t("tours.benefit_safe_text", "Maximum 12 people for your comfort")
    },
    {
      icon: <Coffee size={30} />,
      title: t("tours.benefit_inc_title", "All-Inclusive"),
      text: t("tours.benefit_inc_text", "Transfers, snacks, and guides included")
    },
    {
      icon: <HeartHandshake size={30} />,
      title: t("tours.benefit_comm_title", "Community"),
      text: t("tours.benefit_comm_text", "Meet like-minded people and make friends")
    }
  ];

  return (
    <section className="benefits-section py-5">
      <Container>
        <Row>
          {benefits.map((b, i) => (
            <Col key={i} md={4} className="text-center">
              <div className="benefit-item px-3">
                <div className="benefit-icon-circle mb-3">{b.icon}</div>
                <h5>{b.title}</h5>
                <p className="small text-muted">{b.text}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
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