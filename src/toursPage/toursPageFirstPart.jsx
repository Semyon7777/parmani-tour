import React, { useEffect, useState, useRef, useMemo } from "react";
import { Button, Card, Row, Col, Spinner, Container, Dropdown } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, ArrowUpDown, Clock, ChevronRight, ChevronLeft } from 'lucide-react'; 
import toursData from "./toursData.json";
import ToursPageHeroImg from "./axtala-img.webp";

function ToursPageFirstPart() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  
  const [searchParams, setSearchParams] = useSearchParams();

  // Состояния для фильтров, синхронизированные с URL
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("cat") || "all");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "default");
  const [loading, setLoading] = useState(true);

  // Текущая страница только из URL
  const currentPage = parseInt(searchParams.get("page") || "1");

  const itemsPerPage = 6;
  const toursTopRef = useRef(null);

  // ИСПРАВЛЕНО: Перенес categories внутрь компонента, чтобы ESLint их видел
  const categories = [
    { id: "all", name: t('tour_info_page.filter_all', 'All') },
    { id: "cultural", name: t('tour_info_page.filter_cultural', 'Cultural') },
    { id: "nature", name: t('tour_info_page.filter_nature', 'Nature') },
    { id: "gastronomic", name: t('tour_info_page.filter_gastro', 'Gastro') },
    { id: "religious", name: t('tour_info_page.filter_religious', 'Religious') }
  ];

  const updateParams = (newParams) => {
    const current = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...current, ...newParams });
  };

  const handlePageChange = (page) => {
    updateParams({ page: page.toString() });
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    updateParams({ search: val, page: "1" }); 
  };

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    updateParams({ cat: catId, page: "1" }); 
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
    updateParams({ sort: sortType });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setSortBy("default");
    setSearchParams({}); 
  };

  useEffect(() => {
    if (toursData) setLoading(false);
    
    // Скроллим вверх при ЛЮБОМ изменении страницы
    toursTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [currentPage]);

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

      {/* ЗАГОЛОВОК + КОЛ-ВО ТУРОВ */}
      <div className="tours-list-header mb-4">
        <div>
          <h2 className="tours-list-title">
            {t('tour_info_page.all_tours_title', 'All Tours')}
          </h2>
          <p className="tours-count-text">
            {processedTours.length > 0 ? (
              <>
                {t('tour_info_page.found', 'Found')}{" "}
                <span className="count-number">{processedTours.length}</span>{" "}
                {t('tour_info_page.tours_count', 'tours')}
              </>
            ) : (
              <span className="text-muted fst-italic">
                {t('tour_info_page.no_results', 'No tours found')}
              </span>
            )}
          </p>
        </div>
      </div>

        {/* --- НОВЫЙ БЛОК ФИЛЬТРОВ (Header) --- */}
        <div className="filter-section-wrapper mb-5" ref={toursTopRef}>
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-3">
            <div className="filter-left">
              <div className="category-pills d-flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`pill-btn ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(cat.id)}
                  >
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
                  <AlbumCard tour={tour} />
                </Col>
              ))}
            </Row>
            
            {pageCount > 1 && (
              <div className="pagination-wrapper">
                <div className="custom-pagination">
                  {/* Кнопка Назад */}
                  <button 
                    className="pagination-btn arrow"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {/* Генерация чисел */}
                  {Array.from({ length: pageCount }, (_, i) => {
                    const pageNum = i + 1;
                    
                    // Логика отображения: первая, последняя и соседи текущей
                    if (
                      pageNum === 1 || 
                      pageNum === pageCount || 
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    }

                    // Многоточие
                    if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                      return <span key={pageNum} className="pagination-dots">...</span>;
                    }

                    return null;
                  })}

                  {/* Кнопка Вперед */}
                  <button 
                    className="pagination-btn arrow"
                    disabled={currentPage === pageCount}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-5">
             <h3>😔 {t('tour_info_page.no_results')}</h3>
              <Button variant="link" onClick={resetFilters}>
               {t('tour_info_page.reset_filters')}
             </Button>
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
        <Card.Img variant="top" src={tour.imageUrl} className="tour-card-img" loading="lazy" />
        <div className="card-price-badge">
          <span>{t('tour_info_page.starting_from')} {tour.price}</span>
        </div>
      </div>
      <Card.Body className="d-flex flex-column p-4">
        <Card.Title className="fw-bold mb-2">{tour.title[lang]}</Card.Title>
        <div className="d-flex align-items-center text-muted mb-3 small">
          <Clock size={16} className="me-2 text-success" />
          <span>{tour.duration} {tour.durationUnit === 'days' ? t('tour_info_page.days') : t('tour_info_page.hours')}</span>
        </div>
        <Card.Text className="text-muted small flex-grow-1">{tour.description[lang]}</Card.Text>
        <Link to={`/tours/${tour.id}`} className="mt-3">
          <Button variant="success" className="w-100 rounded-pill">{t('viewTour')}</Button>
        </Link>
      </Card.Body>
    </Card>
  );
});

export default ToursPageFirstPart;