import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom"; // Важно для переходов
import { Leaf, Users, Calendar, MapPin, ArrowRight, TreePine } from "lucide-react";
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./GroupEcoTours.css";

// Данные вынесены в отдельный массив (в будущем перенеси в toursData.json)
const toursData = [
  {
    id: "dilijan-cleanup", // Используем строковые ID для красивых URL
    type: "eco",
    title: "Save the Dilijan Forest",
    date: "25 Oct, 2024",
    price: "5,000 AMD",
    image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d", 
    impact: "Plant 50 Trees",
    spots: 12,
    location: "Dilijan National Park"
  },
  {
    id: "garni-temple",
    type: "group",
    title: "Garni & Geghard Classic",
    date: "26 Oct, 2024",
    price: "12,000 AMD",
    image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc",
    spots: 5,
    location: "Kotayk Region"
  }
];

function GroupEcoTours() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
      window.scrollTo(0, 0);
  }, []);

  const filteredTours = activeTab === "all" 
    ? toursData 
    : toursData.filter(tour => tour.type === activeTab);

  return (
    <div className="scheduled-page">
      <NavbarCustom />
      
      {/* 1. HERO SECTION */}
      <div className="scheduled-hero">
        <div className="hero-content text-center">
          <h1>{t("tours.hero_title", "Join Our Upcoming Adventures")}</h1>
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
            className={`tab-btn eco-tab ${activeTab === 'eco' ? 'active' : ''}`}
            onClick={() => setActiveTab('eco')}
          >
            <Leaf size={18} /> {t("tours.tab_eco", "Eco Missions")}
          </button>
          <button 
            className={`tab-btn group-tab ${activeTab === 'group' ? 'active' : ''}`}
            onClick={() => setActiveTab('group')}
          >
            <Users size={18} /> {t("tours.tab_group", "Group Tours")}
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
                    <img src={tour.image} alt={tour.title} />
                    <div className="tour-badge">
                      {tour.type === 'eco' ? <Leaf size={14}/> : <Users size={14}/>}
                      {tour.type === 'eco' ? ' Eco-Mission' : ' Group Tour'}
                    </div>
                  </div>

                  <div className="tour-content">
                    <div className="tour-date">
                      <Calendar size={16} /> {tour.date}
                    </div>
                    
                    <h3>{tour.title}</h3>
                    
                    <div className="tour-meta">
                      <span><MapPin size={16}/> {tour.location}</span>
                      <span className="spots-left">Only {tour.spots} spots left</span>
                    </div>

                    {tour.type === 'eco' && (
                      <div className="eco-impact-box">
                        <TreePine size={18} color="#2ecc71"/> 
                        <span>Mission: {tour.impact}</span>
                      </div>
                    )}

                    <div className="tour-footer">
                      <div className="price">
                        {tour.price}
                      </div>
                      
                      {/* ОБНОВЛЕННАЯ КНОПКА С СЫЛКОЙ */}
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