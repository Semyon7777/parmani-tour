import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Container, Row, Col, Accordion, Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Users, Calendar, MapPin, ArrowRight, TreePine,
   ShieldCheck, Coffee, Heart, Map, Search, 
   X, LogIn } from "lucide-react";
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import { supabase } from "../supabaseClient";
import GroupEcoToursHeadImg from "./images/Group_Eco_Tours_Head_img.webp"
import "./GroupEcoTours.css";

import SEO from "../Components/SEO";

let toursCache = null;

function GroupEcoTours() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const [allTours, setAllTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentLang = i18n.language || 'en';

  // ✅ Стейт лайков живёт здесь — один запрос, передаём вниз
  const [likedTourIds, setLikedTourIds] = useState(new Set());
  const [currentUser, setCurrentUser]   = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchTours = async () => {
      if (toursCache) {
        setAllTours(toursCache);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('group_eco_tours')
          .select('id, type, title, location, date, price, spots, image')
          .eq('is_active', true);

        if (error) throw error;

        if (data && data.length > 0) toursCache = data;
        setAllTours(data || []);
      } catch (error) {
        console.error("Error loading tours:", error.message);
      } finally {
        setLoading(false);
      }
    };

    // ✅ Загружаем туры и лайки параллельно
    const fetchUserLikes = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      if (!user) return;

      const { data, error } = await supabase
        .from("favourites")
        .select("tour_id")
        .eq("user_id", user.id);

      if (!error && data) {
        setLikedTourIds(new Set(data.map(row => row.tour_id)));
      }
    };

    fetchTours();
    fetchUserLikes();
  }, []);

  // ✅ Обновляем Set лайков — карточки не делают своих запросов
  const handleLikeToggle = (tourId, isNowLiked) => {
    setLikedTourIds(prev => {
      const next = new Set(prev);
      isNowLiked ? next.add(tourId) : next.delete(tourId);
      return next;
    });
  };

  const filteredTours = useMemo(() => {
    // 1. Фильтруем по табу (как и было)
    const filtered = activeTab === "all"
      ? allTours
      : allTours.filter(tour => tour.type === activeTab);

    // Вспомогательная функция для превращения "DD.MM.YYYY" в объект Date
    const parseDate = (dateStr) => {
      if (!dateStr) return new Date(0);
      // Заменяем армянскую точку на обычную
      const normalized = dateStr.replace(/[․]/g, '.');
      const [day, month, year] = normalized.split('.').map(Number);
      return new Date(year, month - 1, day);
    };

    // 2. Умная сортировка
    return [...filtered].sort((a, b) => {
      const sA = Number(a.spots) || 0;
      const sB = Number(b.spots) || 0;

      // ПРАВИЛО 1: Если мест 0 — в самый конец
      if (sA === 0 && sB !== 0) return 1;
      if (sA !== 0 && sB === 0) return -1;

      // ПРАВИЛО 2: Сортировка по дате (от ближайших к дальним)
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);

      if (dateA.getTime() !== dateB.getTime()) {
        return dateA - dateB; 
      }

      // ПРАВИЛО 3: Если даты совпали, показываем тот, где меньше мест
      return sA - sB;
    });
  }, [allTours, activeTab]);

  return (
    <div className="scheduled-page group-eco-tours-container">
      <SEO
        title="Group & Eco Tours in Armenia"
        description="Join our group and eco tours across Armenia. Affordable shared tours with professional guides."
        url="/group-eco-tours"
        lang={currentLang}
        schema={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Group & Eco Tours in Armenia",
          "description": "Join our group and eco tours across Armenia",
          "url": "https://www.parmanitour.com/group-eco-tours",
          "provider": {
            "@type": "TravelAgency",
            "name": "Parmani Tour",
            "url": "https://www.parmanitour.com"
          }
        }}
      />

      <NavbarCustom />

      <div className="scheduled-hero">
        <img 
          src={GroupEcoToursHeadImg} 
          alt="Hero Background" 
          className="hero-bg-img"
          loading="eager" 
          fetchpriority="high"
        />
        <div className="hero-content text-center">
          <h1 className="hero-main-title">
            {t("group_eco_tours.page_title", "Eco & Group Tours")}
          </h1>
          <p>{t("group_eco_tours.hero_subtitle", "Choose your path: Save nature or Explore culture")}</p>
        </div>
      </div>

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


      <TourGrid
        filteredTours={filteredTours}
        currentLang={currentLang}
        t={t}
        activeTab={activeTab}
        loading={loading}
        currentUser={currentUser}
        likedTourIds={likedTourIds}
        onLikeToggle={handleLikeToggle}
      />

      <DynamicInfoSection activeTab={activeTab} currentLang={currentLang} />

      <TourCTA />
      <TourFAQ activeTab={activeTab} />

      <Footer />
    </div>
  );
}


// ─── СКЕЛЕТОН ─────────────────────────────────────────────────
const TourCardSkeleton = () => (
  <Col xs={12} sm={6} lg={4}>
    <div className="tour-card-skeleton">
      <div className="skeleton-img pulse" />
      <div className="skeleton-line pulse" style={{ width: '60%' }} />
      <div className="skeleton-line pulse" style={{ width: '80%' }} />
      <div className="skeleton-line pulse" style={{ width: '40%' }} />
    </div>
  </Col>
);


// ─── КНОПКА-СЕРДЕЧКО ─────────────────────────────────────────
const HeartButton = ({ tourId, isLiked, onLikeToggle, currentUser }) => {
  const { t, i18n } = useTranslation();
  const [pending, setPending] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);

  const lang = (i18n.language || 'en').split('-')[0];

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;

    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    // Оптимистичное обновление — UI реагирует мгновенно
    const wasLiked = isLiked;
    onLikeToggle(tourId, !wasLiked);
    setPending(true);

    let error;
    if (wasLiked) {
      ({ error } = await supabase.from("favourites").delete()
        .eq("user_id", currentUser.id).eq("tour_id", tourId));
    } else {
      ({ error } = await supabase.from("favourites").insert([
        { user_id: currentUser.id, tour_id: tourId }
      ]));
    }

    // Откат при ошибке
    if (error) onLikeToggle(tourId, wasLiked);
    setPending(false);
  };

  return (
    <>
    <button
      onClick={handleToggle}
      disabled={pending}
      style={{
        position: 'absolute', top: '10px', right: '10px',
        background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: '50%',
        width: '34px', height: '34px', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 10,
        cursor: 'pointer',
        transition: 'transform 0.15s ease',
        transform: pending ? 'scale(0.85)' : 'scale(1)',
      }}
    >
      <Heart
        size={16}
        fill={isLiked ? "#ff4d4d" : "transparent"}
        stroke={isLiked ? "#ff4d4d" : "white"}
        style={{ transition: 'fill 0.15s ease, stroke 0.15s ease' }}
      />
    </button>
    {/* JSX для модалки */}
      <Modal 
        show={showLoginModal} 
        onHide={() => setShowLoginModal(false)}
        centered
        className="auth-alert-modal"
      >
        <Modal.Body className="p-4 text-center">
          <div className="auth-alert-icon mb-3">
            <LogIn size={32} strokeWidth={2.5} />
          </div>
          <h4 className="fw-bold mb-2">{t('tour_info_page.login_required_title', 'Authentication Required')}</h4>
          <p className="text-muted mb-4">
            {t('tour_info_page.please_login', 'Please login to save your favorite tours and plan your trip.')}
          </p>
          <div className="d-grid gap-2">
            <Link to={`/${lang}/login`} className="mt-3">
              <Button 
                variant="success" 
                className="py-2 fw-bold w-100"
              >
                {t('auth_page.btn_login', 'Login')}
              </Button>
            </Link>
            <Button 
              variant="light" 
              className="py-2 text-muted"
              onClick={() => setShowLoginModal(false)}
            >
              {t('common.cancel', 'Maybe later')}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};


// ─── ГРИД ТУРОВ ───────────────────────────────────────────────
const TourGrid = React.memo(function TourGrid({
  filteredTours, currentLang, t, activeTab, loading,
  currentUser, likedTourIds, onLikeToggle
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [toursPerPage, setToursPerPage] = useState(6);

  const toursSectionRef = useRef(null);
  const isFirstRender   = useRef(true);
  const prefetchedTours = useRef({});
  const navigate = useNavigate();

  const handleMouseEnter = useCallback(async (tourId) => {
    if (prefetchedTours.current[tourId]) return;
    try {
      const { data } = await supabase
        .from('group_eco_tours').select('*').eq('id', tourId).single();
      if (data) prefetchedTours.current[tourId] = data;
    } catch (err) {
      console.error("Prefetch error:", err);
    }
  }, []);

  const handleTourClick = async (e, tour) => {
    e.preventDefault();
    try {
      let tourData = prefetchedTours.current[tour.id];
      if (!tourData) {
        const { data, error } = await supabase
          .from('group_eco_tours').select('*').eq('id', tour.id).single();
        if (error) throw error;
        tourData = data;
      }
      const path = tour.type === "eco" ? `/${currentLang}/eco-tour/${tour.id}` : `/${currentLang}/group-tour/${tour.id}`;
      navigate(path, { state: { tour: tourData } });
    } catch (err) {
      console.error("Error:", err);
      navigate(tour.type === "eco" ? `${currentLang}/eco-tour/${tour.id}` : `${currentLang}/group-tour/${tour.id}`);
    }
  };

  useEffect(() => {
    const handleResize = () => setToursPerPage(window.innerWidth < 768 ? 4 : 6);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setSearchTerm("");
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    toursSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentPage]);

  const searchedTours = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return filteredTours;
    return filteredTours.filter(tour => {
      const title    = (tour.title?.[currentLang]    || tour.title?.["en"]    || "").toLowerCase();
      const location = (tour.location?.[currentLang] || tour.location?.["en"] || "").toLowerCase();
      return title.includes(query) || location.includes(query);
    });
  }, [filteredTours, searchTerm, currentLang]);

  const totalPages   = Math.ceil(searchedTours.length / toursPerPage);
  const visibleTours = searchedTours.slice((currentPage - 1) * toursPerPage, currentPage * toursPerPage);

  return (
    <section className="tours-list-section py-5" ref={toursSectionRef}>
      <Container>
        <div className="search-section-minimal mb-5">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon-muted" />
            <input
              type="text"
              className="search-input-clean"
              placeholder={t("group_eco_tours.search_placeholder", "Search tours...")}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && <X size={18} className="clear-search-icon" onClick={() => setSearchTerm("")} />}
          </div>
        </div>

        {loading ? (
          <Row className="g-4">
            {[...Array(6)].map((_, i) => <TourCardSkeleton key={i} />)}
          </Row>
        ) : (
          <>
            <Row className="tours-list-section-row g-4">
              {searchedTours.length > 0 ? (
                visibleTours.map(tour => (
                  <Col xs={12} sm={6} lg={4} key={tour.id} className="tours-list-section-row-col">
                    <div
                      className={`tour-card-minimal ${tour.type === "eco" ? "is-eco" : "is-group"}`}
                      onMouseEnter={() => handleMouseEnter(tour.id)}
                    >
                      {/* ✅ position: relative нужен чтобы HeartButton встал на место */}
                      <div className="tour-img-container" style={{ position: 'relative' }}>
                        <img
                          src={tour.image}
                          alt={tour.title?.[currentLang] || tour.title?.["en"]}
                          loading="lazy"
                        />
                        <div className="tour-type-badge">
                          {tour.type === "eco" ? <Leaf size={12} /> : <Users size={12} />}
                          <span>{tour.type === "eco" ? t("group_eco_tours.badge_eco") : t("group_eco_tours.badge_group")}</span>
                        </div>

                        {/* ✅ СЕРДЕЧКО */}
                        <HeartButton
                          tourId={tour.id}
                          isLiked={likedTourIds.has(tour.id)}
                          onLikeToggle={onLikeToggle}
                          currentUser={currentUser}
                        />
                      </div>

                      <div className="tour-body">
                        <div className="tour-date-top">
                          <Calendar size={14} />
                          <span>{tour.date}</span>
                        </div>
                        <h3 className="tour-title-text">
                          {tour.title?.[currentLang] || tour.title?.["en"]}
                        </h3>
                        <div className="tour-details">
                          <div className="detail-item">
                            <MapPin size={14} />
                            <span>{tour.location?.[currentLang] || tour.location?.["en"]}</span>
                          </div>
                          <div className="detail-item spots">
                            <span className="spots-dot"></span>
                            {t("group_eco_tours.only")} {tour.spots} {t("group_eco_tours.spots_left")}
                          </div>
                        </div>

                        {/* {tour.spots <= 10 ? 
                            <div className="detail-item spots">
                              <span className="spots-dot"></span>
                              {t("group_eco_tours.only")} {tour.spots} {t("group_eco_tours.spots_left")}
                            </div>
                          : <div style={{marginBottom: "30px"}}></div>} */}

                        <div className="tour-action-area">
                          <div className="tour-price-tag">{tour.price} {t("group_eco_tours.amd", "AMD")}</div>
                          <Link
                            to={tour.type === "eco" ? `${currentLang}/eco-tour/${tour.id}` : `/${currentLang}/group-tour/${tour.id}`}
                            onClick={e => handleTourClick(e, tour)}
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
                    <h4 className="fw-light">{t("group_eco_tours.no_results", "No tours match your criteria")}</h4>
                  </div>
                </Col>
              )}
            </Row>

            {totalPages > 1 && (
              <div className="pagination-wrapper text-center mt-5">
                <button className="pagination-arrow" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>←</button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    className={`pagination-number ${currentPage === index + 1 ? "active" : ""}`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button className="pagination-arrow" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>→</button>
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
});


// ─── ДИНАМИЧЕСКАЯ СЕКЦИЯ ──────────────────────────────────────
const DynamicInfoSection = ({ activeTab, currentLang }) => {
  const { t } = useTranslation();

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
                    <span className="stat-number">18+</span>
                    <span className="stat-label">{t("group_eco_tours.stats_trees", "Trees Planted")}</span>
                  </div>
                </div>
                <div className="stat-badge">
                  <Leaf size={30} />
                  <div className="stat-text">
                    <span className="stat-number">50kg+</span>
                    <span className="stat-label">{t("group_eco_tours.stats_waste", "Waste Collected")}</span>
                  </div>
                </div>
                <div className="stat-badge">
                  <Map size={30} />
                  <div className="stat-text">
                    <span className="stat-number">4+</span>
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


// ─── CTA БАННЕР ───────────────────────────────────────────────
const TourCTA = () => {
  const { t } = useTranslation();
  return (
    <div className="tour-cta-banner my-5">
      <Container className="text-center p-5 bg-dark text-white tour-cta-banner-container">
        <Col className="tour-cta-banner-col">
        <h2 className="mb-3">{t("group_eco_tours.cta_title", "Didn't find a suitable date?")}</h2>
        <p className="mb-4 opacity-75">{t("group_eco_tours.cta_text", "We can organize a private tour for your group on any day!")}</p>
        </Col>

        <Col>
          <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap">

            {/* WhatsApp */}
            <a
              href="https://wa.me/37495283022"
              className="btn btn-lg rounded-pill px-4 d-inline-flex align-items-center gap-2"
              style={{ backgroundColor: '#25d366', color: '#fff' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-whatsapp" style={{ fontSize: '1.2rem' }} />
              WhatsApp
            </a>

            {/* Telegram */}
            <a
              href="https://t.me/parmanitour"
              className="btn btn-lg rounded-pill px-4 d-inline-flex align-items-center gap-2"
              style={{ backgroundColor: '#229ed9', color: '#fff' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-telegram" style={{ fontSize: '1.2rem' }} />
              Telegram
            </a>

            {/* Viber */}
            <a
              href="viber://chat?number=%2B37495283022"
              className="btn btn-lg rounded-pill px-4 d-inline-flex align-items-center gap-2"
              style={{ backgroundColor: '#7360f2', color: '#fff' }}
            >
              <i className="fab fa-viber" style={{ fontSize: '1.2rem' }} />
              Viber
            </a>

            {/* Email */}
            <a
              href="mailto:info@parmanitour.com"
              className="btn btn-lg rounded-pill px-4 d-inline-flex align-items-center gap-2"
              style={{ backgroundColor: '#4a4a4a', color: '#fff' }}
            >
              <i className="fas fa-envelope" style={{ fontSize: '1.2rem' }} />
              Email
            </a>

          </div>
        </Col>
      </Container>
    </div>
  );
};


// ─── FAQ ──────────────────────────────────────────────────────
const TourFAQ = ({ activeTab }) => {
  const { t } = useTranslation();

  const faqs = {
    all: [
      { q: "group_eco_tours.faq.common_q1", a: "group_eco_tours.faq.common_a1" },
      { q: "group_eco_tours.faq.common_q2", a: "group_eco_tours.faq.common_a2" }
    ],
    eco: [
      { q: "group_eco_tours.faq.eco_about_q", a: "group_eco_tours.faq.eco_about_a" },
      { q: t('group_eco_tours.faq.eco_q1'), a: t('group_eco_tours.faq.eco_a1') },
      { q: t('group_eco_tours.faq.eco_q2'), a: t('group_eco_tours.faq.eco_a2') }
    ],
    group: [
      { q: "group_eco_tours.faq.group_about_q", a: "group_eco_tours.faq.group_about_a" },
      { q: t('group_eco_tours.faq.group_q1'),  a: t('group_eco_tours.faq.group_a1') },
      { q: t('group_eco_tours.faq.group_q2'),  a: t('group_eco_tours.faq.group_a2') },
      { q: t('group_eco_tours.faq.group_q3'),  a: t('group_eco_tours.faq.group_a3') },
      { q: t('group_eco_tours.faq.group_q4'),  a: t('group_eco_tours.faq.group_a4') },
      { q: t('group_eco_tours.faq.group_q5'),  a: t('group_eco_tours.faq.group_a5') },
      { q: t('group_eco_tours.faq.group_q6'),  a: t('group_eco_tours.faq.group_a6') },
      { q: t('group_eco_tours.faq.group_q7'),  a: t('group_eco_tours.faq.group_a7') },
      { q: t('group_eco_tours.faq.group_q8'),  a: t('group_eco_tours.faq.group_a8') },
      { q: t('group_eco_tours.faq.group_q9'),  a: t('group_eco_tours.faq.group_a9') },
      { q: t('group_eco_tours.faq.group_q10'), a: t('group_eco_tours.faq.group_a10') },
      { q: t('group_eco_tours.faq.group_q11'), a: t('group_eco_tours.faq.group_a11') },
      { q: t('group_eco_tours.faq.group_q12'), a: t('group_eco_tours.faq.group_a12') },
      { q: t('group_eco_tours.faq.group_q13'), a: t('group_eco_tours.faq.group_a13') },
      { q: t('group_eco_tours.faq.group_q14'), a: t('group_eco_tours.faq.group_a14') }
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
              <Accordion.Header className="minimal-faq-trigger">{t(item.q)}</Accordion.Header>
              <Accordion.Body className="minimal-faq-body">{t(item.a)}</Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </section>
  );
};

export default GroupEcoTours;