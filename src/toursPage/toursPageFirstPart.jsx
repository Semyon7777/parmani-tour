import React, { useEffect, useState, useRef, useMemo } from "react";
import { Button, Card, Row, Col, Spinner, Container, Dropdown } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, ArrowUpDown, Clock, ChevronRight, ChevronLeft, User, Heart } from 'lucide-react';
import toursData from "./toursData.json";
import { supabase } from "../supabaseClient";
import ToursPageHeroImg from "./axtala-img.webp";
 
function ToursPageFirstPart() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
 
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery]   = useState(searchParams.get("search") || "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("cat") || "all");
  const [sortBy, setSortBy]             = useState(searchParams.get("sort") || "default");
  const [loading, setLoading]           = useState(true);
  const [likedTourIds, setLikedTourIds] = useState(new Set());
 
  const currentPage  = parseInt(searchParams.get("page") || "1");
  const itemsPerPage = 6;
  const toursTopRef  = useRef(null);
 
  const categories = [
    { id: "all",         name: t('tour_info_page.filter_all',      'All') },
    { id: "cultural",    name: t('tour_info_page.filter_cultural',  'Cultural') },
    { id: "nature",      name: t('tour_info_page.filter_nature',    'Nature') },
    { id: "gastronomic", name: t('tour_info_page.filter_gastro',    'Gastro') },
    { id: "religious",   name: t('tour_info_page.filter_religious', 'Religious') },
  ];
 
  // Один запрос на все лайки пользователя при загрузке страницы
  useEffect(() => {
    const fetchUserLikes = async () => {
      setLoading(false);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
 
      const { data, error } = await supabase
        .from("favourites")
        .select("tour_id")
        .eq("user_id", user.id);
 
      if (!error && data) {
        setLikedTourIds(new Set(data.map(row => row.tour_id)));
      }
    };
    fetchUserLikes();
  }, []);
 
  useEffect(() => {
    toursTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [currentPage]);
 
  // ✅ ОПТИМИЗАЦИЯ: обновляем Set в родителе — карточки не делают своих запросов
  const handleLikeToggle = (tourId, isNowLiked) => {
    setLikedTourIds(prev => {
      const next = new Set(prev);
      isNowLiked ? next.add(tourId) : next.delete(tourId);
      return next;
    });
  };
 
  const updateParams      = (p) => setSearchParams({ ...Object.fromEntries(searchParams.entries()), ...p });
  const handlePageChange  = (page)     => updateParams({ page: page.toString() });
  const handleSearchChange= (val)      => { setSearchQuery(val);    updateParams({ search: val,  page: "1" }); };
  const handleCategoryChange= (catId)  => { setActiveCategory(catId); updateParams({ cat: catId, page: "1" }); };
  const handleSortChange  = (sortType) => { setSortBy(sortType);    updateParams({ sort: sortType }); };
  const resetFilters      = () => { setSearchQuery(""); setActiveCategory("all"); setSortBy("default"); setSearchParams({}); };
 
  const processedTours = useMemo(() => {
    const lowerCaseSearch = searchQuery.toLowerCase();
    return [...toursData]
      .filter(tour => {
        const matchesSearch =
          tour.title[lang]?.toLowerCase().includes(lowerCaseSearch) ||
          tour.description[lang]?.toLowerCase().includes(lowerCaseSearch);
        const matchesCategory =
          activeCategory === "all" ||
          (Array.isArray(tour.category) ? tour.category.includes(activeCategory) : tour.category === activeCategory);
        let matchesDuration = true;
        if (sortBy === "filter_1day")    matchesDuration = tour.durationUnit === "hours" || (tour.durationUnit === "days" && tour.duration === 1);
        if (sortBy === "filter_multiday") matchesDuration = tour.durationUnit === "days" && tour.duration > 1;
        return matchesSearch && matchesCategory && matchesDuration;
      })
      .sort((a, b) => {
        const priceA = parseInt(a.price.toString().replace(/\D/g, '')) || 0;
        const priceB = parseInt(b.price.toString().replace(/\D/g, '')) || 0;
        if (sortBy === "priceAsc")  return priceA - priceB;
        if (sortBy === "priceDesc") return priceB - priceA;
        if (sortBy === "name")      return a.title[lang].localeCompare(b.title[lang]);
        return 0;
      });
  }, [searchQuery, activeCategory, sortBy, lang]);
 
  const indexOfLastTour  = currentPage * itemsPerPage;
  const indexOfFirstTour = indexOfLastTour - itemsPerPage;
  const currentTours     = processedTours.slice(indexOfFirstTour, indexOfLastTour);
  const pageCount        = Math.ceil(processedTours.length / itemsPerPage);
 
  return (
    <div className="tours-page-wrapper">
      <div className="tours-hero-simple">
        <img src={ToursPageHeroImg} alt="Hero" className="hero-bg-img" fetchpriority="high" />
        <div className="hero-content text-center">
          <h1 className="hero-title">{t('tour_info_page.title')}</h1>
          <p className="hero-subtitle">{t('tour_info_page.subtitle')}</p>
          <div className="search-box-container mx-auto">
            <div className="search-bar-modern">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => handleSearchChange(e.target.value)}
                placeholder={t('tour_info_page.search_tours')}
              />
            </div>
          </div>
        </div>
      </div>
 
      <Container className="py-5">
        <div className="tours-list-header mb-4">
          <div>
            <h2 className="tours-list-title">{t('tour_info_page.all_tours_title', 'All Tours')}</h2>
            <p className="tours-count-text">
              {processedTours.length > 0 ? (
                <>{t('tour_info_page.found', 'Found')} <span className="count-number">{processedTours.length}</span> {t('tour_info_page.tours_count', 'tours')}</>
              ) : (
                <span className="text-muted fst-italic">{t('tour_info_page.no_results', 'No tours found')}</span>
              )}
            </p>
          </div>
        </div>
 
        <div className="filter-section-wrapper mb-5" ref={toursTopRef}>
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-3">
            <div className="filter-left">
              <div className="category-pills d-flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button key={cat.id} className={`pill-btn ${activeCategory === cat.id ? 'active' : ''}`} onClick={() => handleCategoryChange(cat.id)}>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-right d-flex align-items-center gap-3">
              <Dropdown onSelect={(e) => handleSortChange(e)}>
                <Dropdown.Toggle variant="outline-dark" className="rounded-pill">
                  <ArrowUpDown size={16} className="me-2" /> {t('tour_info_page.sort_by')}
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item eventKey="default">{t('tour_info_page.sort_default')}</Dropdown.Item>
                  <Dropdown.Item eventKey="priceAsc">{t('tour_info_page.sort_price_low')}</Dropdown.Item>
                  <Dropdown.Item eventKey="priceDesc">{t('tour_info_page.sort_price_high')}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
 
        {loading ? (
          <div className="text-center my-5"><Spinner animation="border" variant="success" /></div>
        ) : processedTours.length > 0 ? (
          <>
            <Row>
              {currentTours.map((tour) => (
                <Col key={tour.id} sm={12} md={6} lg={4} className="mb-4">
                  <AlbumCard
                    tour={tour}
                    isLiked={likedTourIds.has(tour.id)}
                    onLikeToggle={handleLikeToggle}
                  />
                </Col>
              ))}
            </Row>
 
            {pageCount > 1 && (
              <div className="pagination-wrapper">
                <div className="custom-pagination">
                  <button className="pagination-btn arrow" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                    <ChevronLeft size={20} />
                  </button>
                  {Array.from({ length: pageCount }, (_, i) => {
                    const pageNum = i + 1;
                    if (pageNum === 1 || pageNum === pageCount || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                      return (
                        <button key={pageNum} className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`} onClick={() => handlePageChange(pageNum)}>
                          {pageNum}
                        </button>
                      );
                    }
                    if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                      return <span key={pageNum} className="pagination-dots">...</span>;
                    }
                    return null;
                  })}
                  <button className="pagination-btn arrow" disabled={currentPage === pageCount} onClick={() => handlePageChange(currentPage + 1)}>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-5">
            <h3>😔 {t('tour_info_page.no_results')}</h3>
            <Button variant="link" onClick={resetFilters}>{t('tour_info_page.reset_filters')}</Button>
          </div>
        )}
      </Container>
    </div>
  );
}
 
 
// ─── КАРТОЧКА ТУРА ────────────────────────────────────────────
const AlbumCard = React.memo(({ tour, isLiked, onLikeToggle }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
 
  // Локальный стейт только для блокировки кнопки пока идёт запрос
  const [pending, setPending] = useState(false);
 
  const handleToggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;
 
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert(t('tour_info_page.please_login', 'Please login to save tours'));
      return;
    }
 
    // ✅ ОПТИМИСТИЧНОЕ ОБНОВЛЕНИЕ:
    // 1. Сразу меняем цвет сердечка — UI реагирует мгновенно
    // 2. Параллельно отправляем запрос в Supabase
    // 3. Если Supabase вернул ошибку — откатываем назад
    const wasLiked = isLiked;
    onLikeToggle(tour.id, !wasLiked); // ← сразу обновляем UI
    setPending(true);
 
    let error;
    if (wasLiked) {
      ({ error } = await supabase.from("favourites").delete().eq("user_id", user.id).eq("tour_id", tour.id));
    } else {
      ({ error } = await supabase.from("favourites").insert([{ user_id: user.id, tour_id: tour.id }]));
    }
 
    // Если ошибка — возвращаем предыдущее состояние
    if (error) onLikeToggle(tour.id, wasLiked);
 
    setPending(false);
  };
 
  return (
    <Card className="tour-card-modern border-0 shadow-sm h-100 position-relative">
      <div className="card-img-wrapper">
        <Card.Img variant="top" src={tour.imageUrl} className="tour-card-img" loading="lazy" />
 
        <button
          className={`favourite-btn ${isLiked ? 'active' : ''}`}
          onClick={handleToggleLike}
          disabled={pending}
          style={{
            position: 'absolute', top: '15px', right: '15px',
            background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: '50%',
            width: '36px', height: '36px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 10,
            // Плавная анимация цвета
            transition: 'transform 0.15s ease',
            transform: pending ? 'scale(0.85)' : 'scale(1)',
          }}
        >
          <Heart
            size={18}
            fill={isLiked ? "#ff4d4d" : "transparent"}
            stroke={isLiked ? "#ff4d4d" : "white"}
            style={{ transition: 'fill 0.15s ease, stroke 0.15s ease' }}
          />
        </button>
 
        <div className="card-price-badge">
          <div className="d-flex align-items-center gap-2">
            <span>{t('tour_info_page.starting_from')} {tour.price}</span>
            <div className="d-flex align-items-center opacity-90" style={{ borderLeft: '1px solid rgba(255,255,255,0.3)', paddingLeft: '8px' }}>
              <div className="d-flex align-items-center gap-1">
                <User size={14} strokeWidth={2.5} />
                <span style={{ fontSize: '0.9em' }}>x 4</span>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      <Card.Body className="d-flex flex-column p-4">
        <Card.Title className="fw-bold mb-2">{tour.title[lang]}</Card.Title>
        <div className="d-flex align-items-center text-muted mb-3 small">
          <Clock size={16} className="me-2 text-success" />
          <span>{tour.duration} {tour.durationUnit === 'days' ? t('tour_info_page.days') : t('tour_info_page.hours')}</span>
        </div>
        <Card.Text className="text-muted small flex-grow-1">{tour.description[lang]}</Card.Text>
        <Link to={`/private-tours/${tour.id}`} className="mt-3">
          <Button variant="success" className="w-100 rounded-pill">{t('viewTour')}</Button>
        </Link>
      </Card.Body>
    </Card>
  );
});
 
export default ToursPageFirstPart;