import React, { useEffect, useState, useRef, useMemo } from "react";
import { Button, Card, Row, Col, Spinner, Container, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, User, ArrowUpDown, Clock } from 'lucide-react'; 
import toursData from "./toursData.json";
import ToursPageHeroImg from "./axtala-img.webp";

function ToursPageFirstPart() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  
  // Состояния
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const itemsPerPage = 6;
  const toursTopRef = useRef(null);

  // Список категорий (можно вынести в JSON)
  const categories = [
    { id: "all", name: t('tour_info_page.filter_all', 'All') },
    { id: "cultural", name: t('tour_info_page.filter_cultural', 'Cultural') },
    { id: "nature", name: t('tour_info_page.filter_nature', 'Nature') },
    { id: "gastronomic", name: t('tour_info_page.filter_gastro', 'Gastro') },
    { id: "religious", name: t('tour_info_page.filter_religious', 'Religious') }
  ];

  useEffect(() => {
    if (toursData) setLoading(false);
    if (currentPage > 1) { 
      toursTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  // --- ЛОГИКА ФИЛЬТРАЦИИ И СОРТИРОВКИ ---
  const processedTours = useMemo(() => {
    const lowerCaseSearch = searchQuery.toLowerCase();

    return [...toursData]
      .filter(tour => {
        const matchesSearch = 
          tour.title[lang]?.toLowerCase().includes(lowerCaseSearch) ||
          tour.description[lang]?.toLowerCase().includes(lowerCaseSearch);
        
        const matchesCategory = activeCategory === "all" || tour.category === activeCategory;

        let matchesDuration = true;
        if (sortBy === "filter_1day") {
          matchesDuration = tour.durationUnit === "hours" || (tour.durationUnit === "days" && tour.duration === 1);
        } else if (sortBy === "filter_multiday") {
          matchesDuration = tour.durationUnit === "days" && tour.duration > 1;
        }

        return matchesSearch && matchesCategory && matchesDuration;
      })
      .sort((a, b) => {
        const priceA = parseInt(a.price.toString().replace(/\D/g, '')) || 0;
        const priceB = parseInt(b.price.toString().replace(/\D/g, '')) || 0;

        if (sortBy === "priceAsc") return priceA - priceB;
        if (sortBy === "priceDesc") return priceB - priceA;
        if (sortBy === "name") return a.title[lang].localeCompare(b.title[lang]);
        
        return 0;
      });
  }, [searchQuery, activeCategory, sortBy, lang]);

  const indexOfLastTour = currentPage * itemsPerPage;
  const indexOfFirstTour = indexOfLastTour - itemsPerPage;
  const currentTours = processedTours.slice(indexOfFirstTour, indexOfLastTour);
  const pageCount = Math.ceil(processedTours.length / itemsPerPage);

  return (
    <div className="tours-page-wrapper">
      
      {/* Hero-блок оставляем без изменений */}
      <div className="tours-hero-simple">
        <img 
          src={ToursPageHeroImg}
          alt="Hero Background" 
          className="hero-bg-img"
          fetchpriority="high" 
        />
        <div className="hero-content text-center">
          <h1 className="hero-title">{t('tour_info_page.title')}</h1>
          <p className="hero-subtitle">{t('tour_info_page.subtitle')}</p>
          <div className="search-box-container mx-auto">
            <div className="search-bar-modern">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder={t('tour_info_page.search_tours')}
                value={searchQuery} 
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <Container className="py-5">
        {/* --- НОВЫЙ БЛОК ФИЛЬТРОВ (Header) --- */}
        <div className="filter-section-wrapper mb-5" ref={toursTopRef}>
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-3">
            
            <div className="filter-left">
              <h2 className="section-title mb-3">
                {searchQuery ? t('tour_info_page.results_for') : t('tour_info_page.popular_tours')}
                {searchQuery && <span className="text-success">: {searchQuery}</span>}
              </h2>
              
              {/* Категории в виде пилюль */}
              <div className="category-pills d-flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`pill-btn ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => { setActiveCategory(cat.id); setCurrentPage(1); }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-right d-flex align-items-center gap-3">
              <div className="tours-count-badge">
                <strong>{processedTours.length}</strong> {t('tour_info_page.tours_found')}
              </div>

              {/* Сортировка */}
              <Dropdown onSelect={(e) => setSortBy(e)}>
                <Dropdown.Toggle variant="outline-dark" id="dropdown-sort" className="rounded-pill d-flex align-items-center gap-2">
                  <ArrowUpDown size={16} /> {t('tour_info_page.sort_by', 'Sort')}
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item eventKey="default">{t('tour_info_page.sort_default', 'Default')}</Dropdown.Item>
                  <Dropdown.Item eventKey="filter_1day">{t('tour_info_page.only_1day', '1 Day Tours')}</Dropdown.Item>
                  <Dropdown.Item eventKey="filter_multiday">{t('tour_info_page.only_multiday', 'Multi-day Tours')}</Dropdown.Item>
                  <Dropdown.Item eventKey="priceAsc">{t('tour_info_page.sort_price_low', 'Price: Low to High')}</Dropdown.Item>
                  <Dropdown.Item eventKey="priceDesc">{t('tour_info_page.sort_price_high', 'Price: High to Low')}</Dropdown.Item>
                  <Dropdown.Item eventKey="name">{t('tour_info_page.sort_name', 'By Name')}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

          </div>
        </div>

        {/* --- СЕТКА ТУРОВ --- */}
        {loading ? (
          <div className="text-center my-5"><Spinner animation="border" variant="success" /></div>
        ) : processedTours.length > 0 ? (
          <Row>
            {currentTours.map((tour) => (
              <Col key={tour.id} sm={12} md={6} lg={4} className="mb-4">
                <AlbumCard tour={tour} />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-5">
             <h3>😔 {t('tour_info_page.no_results', 'No tours found matching your filters')}</h3>
              <Button variant="link" 
                onClick={() => {setActiveCategory("all");
                setSearchQuery("");
                setSortBy("default");
              }}>
               {t('tour_info_page.reset_filters', 'Reset all filters')}
             </Button>
          </div>
        )}
        
        {/* Пагинация (остается как была) */}
        {pageCount > 1 && (
          <div className="pagination-wrapper mt-4">
            {Array.from({ length: pageCount }, (_, i) => (
              <Button
                key={i + 1}
                className={`pagination-circle ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}


const AlbumCard = React.memo(({ tour }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";

  return (
    <Card className="tour-card-modern border-0 shadow-sm h-100">
      <div className="card-img-wrapper">
        <Card.Img 
          variant="top" 
          src={tour.imageUrl} 
          className="tour-card-img" 
          loading="lazy"
        />
        <div className="card-price-badge d-flex align-items-center">
          <span>
            {t('tour_info_page.starting_from')} {tour.price}
          </span>
          <span className="mx-2" style={{ opacity: 0.5 }}>|</span>
          <div className="d-flex align-items-center">
            <span className="me-1">4 x</span>
            <User size={14} strokeWidth={2.5} />
          </div>
        </div>
      </div>
      
      <Card.Body className="d-flex flex-column p-4">
        <Card.Title className="fw-bold mb-2">{tour.title[lang]}</Card.Title>
        
        {/* === НОВЫЙ БЛОК: ДЛИТЕЛЬНОСТЬ === */}
        <div className="d-flex align-items-center text-muted mb-3" style={{ fontSize: '0.9rem', fontWeight: '500' }}>
          <Clock size={16} className="me-2" style={{ color: '#2ecc71' }} />
          <span>
            {tour.duration} {tour.durationUnit === 'days' ? t('tour_info_page.days') : t('tour_info_page.hours')}
          </span>
        </div>
        
        <Card.Text className="text-muted small flex-grow-1 tour-description-text">
          {tour.description[lang]}
        </Card.Text>
        
        <Link to={`/tours/${tour.id}`} className="mt-3">
          <Button variant="success" className="w-100 rounded-pill">
            {t('viewTour', 'View Details')}
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
});

export default ToursPageFirstPart;