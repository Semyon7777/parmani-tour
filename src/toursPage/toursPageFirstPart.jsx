import React, { useEffect, useState, useRef } from "react";
import { Button, Card, Row, Col, Spinner, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react'; // Иконки для красоты
import toursData from "./toursData.json";

function ToursPageFirstPart() {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;
  const toursTopRef = useRef(null); // Ссылка на начало списка туров

  useEffect(() => {
    if (toursData) setLoading(false);

    // Скроллим к началу, только когда реально изменился номер страницы
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

  }, [currentPage]);

  const filteredTours = toursData.filter(tour => {
    const lang = i18n.language || "en";
    const title = tour.title[lang] || "";
    const description = tour.description[lang] || "";
    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastTour = currentPage * itemsPerPage;
  const indexOfFirstTour = indexOfLastTour - itemsPerPage;
  const currentTours = filteredTours.slice(indexOfFirstTour, indexOfLastTour);
  const pageCount = Math.ceil(filteredTours.length / itemsPerPage);

  return (
    <div className="tours-page-wrapper">
      
      {/* --- НОВЫЙ HERO-БЛОК --- */}
      <div className="tours-hero-simple">
        <div className="hero-content">
          <h1 className="hero-title">{t('toursPage.title', 'Discover Armenia')}</h1>
          <p className="hero-subtitle">{t('toursPage.subtitle', 'Unforgettable adventures wait for you')}</p>
          
          {/* УЛУЧШЕННЫЙ ПОИСК */}
          <div className="search-box-container">
            <div className="search-bar-modern">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder={t('searchTours', 'Where do you want to go?')}
                value={searchQuery} 
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Сбрасываем страницу при поиске
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- СПИСОК КАРТОЧЕК --- */}
      <Container className="py-5">
        <div className="tours-grid-header mb-4" ref={toursTopRef}>
          <h2>{searchQuery ? `${t('results_for')}: ${searchQuery}` : t('popular_tours')}</h2>
          <div className="tours-count">{filteredTours.length} {t('tours_found')}</div>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="success" />
          </div>
        ) : (
          <Row>
            {currentTours.map((tour) => (
              <Col key={tour.id} sm={12} md={6} lg={4} className="mb-4">
                <AlbumCard tour={tour} />
              </Col>
            ))}
          </Row>
        )}
        
        {/* ПАГИНАЦИЯ */}
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

const AlbumCard = ({ tour }) => {
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
        <div className="card-price-badge">{t('tour_info_page.starting_from')} {tour.price}</div>
      </div>
      <Card.Body className="d-flex flex-column p-4">
        <Card.Title className="fw-bold mb-2">{tour.title[lang]}</Card.Title>
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
};

export default ToursPageFirstPart;