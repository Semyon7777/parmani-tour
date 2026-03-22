import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Container, Row, Col, Accordion } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Users, Calendar, MapPin, ArrowRight, TreePine,
   ShieldCheck, Coffee, Heart, MessageCircle, Map, Search, X } from "lucide-react";
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import { supabase } from "../supabaseClient";
import "./GroupEcoTours.css";

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
    return activeTab === "all"
      ? allTours
      : allTours.filter(tour => tour.type === activeTab);
  }, [allTours, activeTab]);

  return (
    <div className="scheduled-page group-eco-tours-container">
      <NavbarCustom />

      <div className="scheduled-hero">
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

      <DynamicInfoSection activeTab={activeTab} currentLang={currentLang} />

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
  const { t } = useTranslation();
  const [pending, setPending] = useState(false);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;

    if (!currentUser) {
      alert(t("group_eco_tours.please_login", "Please login to save tours"));
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
      const path = tour.type === "eco" ? `/eco-tour/${tour.id}` : `/group-tour/${tour.id}`;
      navigate(path, { state: { tour: tourData } });
    } catch (err) {
      console.error("Error:", err);
      navigate(tour.type === "eco" ? `/eco-tour/${tour.id}` : `/group-tour/${tour.id}`);
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

                        <div className="tour-action-area">
                          <div className="tour-price-tag">{tour.price}</div>
                          <Link
                            to={tour.type === "eco" ? `/eco-tour/${tour.id}` : `/group-tour/${tour.id}`}
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
                    <span className="stat-number">150+</span>
                    <span className="stat-label">{t("group_eco_tours.stats_trees", "Trees Planted")}</span>
                  </div>
                </div>
                <div className="stat-badge">
                  <Leaf size={30} />
                  <div className="stat-text">
                    <span className="stat-number">500kg+</span>
                    <span className="stat-label">{t("group_eco_tours.stats_waste", "Waste Collected")}</span>
                  </div>
                </div>
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
      { q: "group_eco_tours.faq.eco_q1",      a: "group_eco_tours.faq.eco_a1" },
      { q: "group_eco_tours.faq.common_q2",   a: "group_eco_tours.faq.common_a2" }
    ],
    group: [
      { q: "group_eco_tours.faq.group_about_q", a: "group_eco_tours.faq.group_about_a" },
      { q: "group_eco_tours.faq.group_q1",      a: "group_eco_tours.faq.group_a1" },
      { q: "group_eco_tours.faq.common_q1",     a: "group_eco_tours.faq.common_a1" }
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