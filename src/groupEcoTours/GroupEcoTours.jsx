import React, { useState, useEffect, useMemo, useRef } from "react";
import { Container, Row, Col, Accordion } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Leaf, Users, Calendar, MapPin, ArrowRight, TreePine,
   ShieldCheck, Coffee, Heart, MessageCircle, Map, Search, X } from "lucide-react";
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
    <div className="scheduled-page group-eco-tours-container">
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
      <TourGrid 
        filteredTours={filteredTours} 
        currentLang={currentLang} 
        t={t}
        activeTab={activeTab}
      />

      <TourCTA />


      {/* FAQ SECTION */}
      <TourFAQ activeTab={activeTab} />
      
      <Footer />
    </div>
  );
}

function TourGrid({ filteredTours, currentLang, t, activeTab }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const toursSectionRef = useRef(null);

  const [toursPerPage, setToursPerPage] = useState(6);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setToursPerPage(4); // мобильный экран
      } else {
        setToursPerPage(6); // планшет/десктоп
      }
    };

    handleResize(); // установить сразу при монтировании

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    setSearchTerm("");
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
  if (toursSectionRef.current) {
    toursSectionRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}, [currentPage]);

  // Поиск
  const searchedTours = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return filteredTours;

    return filteredTours.filter((tour) => {
      const title =
        (tour.title?.[currentLang] ||
          tour.title?.["en"] ||
          "").toLowerCase();

      const location =
        (tour.location?.[currentLang] ||
          tour.location?.["en"] ||
          "").toLowerCase();

      const impact =
        (tour.impact?.[currentLang] ||
          tour.impact?.["en"] ||
          "").toLowerCase();

      return (
        title.includes(query) ||
        location.includes(query) ||
        impact.includes(query)
      );
    });
  }, [filteredTours, searchTerm, currentLang]);

  const totalPages = Math.ceil(searchedTours.length / toursPerPage);

  const startIndex = (currentPage - 1) * toursPerPage;
  const endIndex = startIndex + toursPerPage;

  const visibleTours = searchedTours.slice(startIndex, endIndex);


  return (
    <section className="tours-list-section py-5" ref={toursSectionRef}>
      <Container>

        {/* SEARCH */}
        <div className="search-section-minimal mb-5">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon-muted" />

            <input
              type="text"
              className="search-input-clean"
              placeholder={t(
                "group_eco_tours.search_placeholder",
                "Search tours..."
              )}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm && (
              <X
                size={18}
                className="clear-search-icon"
                onClick={() => setSearchTerm("")}
              />
            )}
          </div>

          {searchTerm && (
            <div className="search-meta-line">
              <span className="results-count">
                {searchedTours.length}{" "}
                {t("group_eco_tours.found", "found")}
              </span>
            </div>
          )}
        </div>

        {/* GRID */}
        <Row className="tours-list-section-row g-4">
          {searchedTours.length > 0 ? (
            visibleTours.map((tour) => (
              <Col xs={6} md={6} lg={4} key={tour.id} className="tours-list-section-row-col">
                <div
                  className={`tour-card-minimal ${
                    tour.type === "eco" ? "is-eco" : "is-group"
                  }`}
                >
                  {/* IMAGE */}
                  <div className="tour-img-container">
                    <img
                      src={tour.image}
                      alt={
                        tour.title?.[currentLang] ||
                        tour.title?.["en"]
                      }
                      loading="lazy"
                    />

                    <div className="tour-type-badge">
                      {tour.type === "eco" ? (
                        <Leaf size={12} />
                      ) : (
                        <Users size={12} />
                      )}

                      <span>
                        {tour.type === "eco"
                          ? t("group_eco_tours.badge_eco")
                          : t("group_eco_tours.badge_group")}
                      </span>
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="tour-body">
                    <div className="tour-date-top">
                      <Calendar size={14} />
                      <span>{tour.date}</span>
                    </div>

                    <h3 className="tour-title-text">
                      {tour.title?.[currentLang] ||
                        tour.title?.["en"]}
                    </h3>

                    <div className="tour-details">
                      <div className="detail-item">
                        <MapPin size={14} />
                        <span>
                          {tour.location?.[currentLang] ||
                            tour.location?.["en"]}
                        </span>
                      </div>

                      <div className="detail-item spots">
                        <span className="spots-dot"></span>
                        {t("group_eco_tours.only")}{" "}
                        {tour.spots}{" "}
                        {t("group_eco_tours.spots_left")}
                      </div>
                    </div>

                    {tour.type === "eco" && (
                      <div className="eco-mission-stripe">
                        <TreePine size={16} />
                        <p>
                          {t("group_eco_tours.mission")}:{" "}
                          {tour.impact?.[currentLang] ||
                            tour.impact?.["en"]}
                        </p>
                      </div>
                    )}

                    <div className="tour-action-area">
                      <div className="tour-price-tag">
                        {tour.price}
                      </div>

                      <Link
                        to={
                          tour.type === "eco"
                            ? `/eco-tour/${tour.id}`
                            : `/group-tour/${tour.id}`
                        }
                        className="tour-btn-minimal"
                      >
                        {t("group_eco_tours.btn_join")}
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </Col>
            ))
          ) : (
            <Col xs={12} className="text-center py-5">
              <div className="no-results-state">
                <h4 className="fw-light">
                  {t(
                    "group_eco_tours.no_results",
                    "No tours match your criteria"
                  )}
                </h4>

                <button
                  className="btn btn-link text-dark"
                  onClick={() => setSearchTerm("")}
                >
                  {t(
                    "group_eco_tours.clear_filters",
                    "Reset search"
                  )}
                </button>
              </div>
            </Col>
          )}
        </Row>

        {/* SHOW MORE */}
        {totalPages > 1 && (
          <div className="pagination-wrapper text-center mt-5">
            <button
              className="pagination-arrow"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              ←
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  className={`pagination-number ${
                    currentPage === pageNumber ? "active" : ""
                  }`}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              className="pagination-arrow"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              →
            </button>
          </div>
        )}
      </Container>
    </section>
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
                  <div className="stat-text">
                    <span className="stat-number">150+</span>
                    <span className="stat-label">{t("group_eco_tours.stats_trees", "Trees Planted")}</span>
                  </div>
                </div>

                {/* Мусор */}
                <div className="stat-badge">
                  <Leaf size={30} />
                  <div className="stat-text">
                    <span className="stat-number">500kg+</span>
                    <span className="stat-label">{t("group_eco_tours.stats_waste", "Waste Collected")}</span>
                  </div>
                </div>

                {/* Благоустройство */}
                <div className="stat-badge">
                  <Map size={30} />
                  <div className="stat-text">
                    <span className="stat-number">12+</span>
                    <span className="stat-label">{t("group_eco_tours.stats_areas", "Areas Improved")}</span>
                  </div>
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


const TourFAQ = ({ activeTab }) => {
  const { t } = useTranslation();

  const faqs = {
    all: [
      { q: "group_eco_tours.faq.common_q1", a: "group_eco_tours.faq.common_a1" },
      { q: "group_eco_tours.faq.common_q2", a: "group_eco_tours.faq.common_a2" }
    ],
    eco: [
      { q: "group_eco_tours.faq.eco_about_q", a: "group_eco_tours.faq.eco_about_a" },
      { q: "group_eco_tours.faq.eco_q1", a: "group_eco_tours.faq.eco_a1" },
      { q: "group_eco_tours.faq.common_q2", a: "group_eco_tours.faq.common_a2" }
    ],
    group: [
      { q: "group_eco_tours.faq.group_about_q", a: "group_eco_tours.faq.group_about_a" },
      { q: "group_eco_tours.faq.group_q1", a: "group_eco_tours.faq.group_a1" },
      { q: "group_eco_tours.faq.common_q1", a: "group_eco_tours.faq.common_a1" }
    ]
  };

  const currentList = faqs[activeTab] || faqs.all;

  return (
    <section className={`minimal-faq-wrapper faq-theme-${activeTab}`}>
      <Container className="minimal-faq-container">
        
        <div className="minimal-faq-header text-center">
          <span className="minimal-faq-subtitle">{t(`group_eco_tours.faq.subtitle_${activeTab}`)}</span>
          <h2 className="minimal-faq-title">{t("group_eco_tours.faq.main_title")}</h2>
        </div>

        <Accordion flush className="minimal-faq-accordion">
          {currentList.map((item, idx) => (
            <Accordion.Item eventKey={idx.toString()} key={idx} className="minimal-faq-item">
              <Accordion.Header className="minimal-faq-trigger">
                {t(item.q)}
              </Accordion.Header>
              <Accordion.Body className="minimal-faq-body">
                {t(item.a)}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>

      </Container>
    </section>
  );
};

export default GroupEcoTours;