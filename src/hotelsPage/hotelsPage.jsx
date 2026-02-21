import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./hotelsPage.css";

const HotelsPage = () => {
  const { t } = useTranslation();

    React.useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

  const hotelsItems = [
    {
        id: 1,
        key: "luxury_yerevan",
        rating: "★★★★☆",
        price: 120,
    },
    {
        id: 2,
        key: "sevan_resort",
        rating: "★★★★★",
        price: 150,
    },
    {
        id: 3,
        key: "dilijan_lodge",
        rating: "★★★☆☆",
        price: 90,
    },
  ];

  return (
    <div className="hotels-container">
      <NavbarCustom />

      {/* HERO */}
      <section className="hotels-hero-section">
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col lg={7}>
              <h1 className="hotels-hero-title">
                {t("hotels_page.hero_title")}
              </h1>

              <p className="hotels-hero-subtitle">
                {t("hotels_page.hero_subtitle")}
              </p>

              {/* SEARCH FORM */}
              <div className="hotels-search-box">
                <input
                  type="text"
                  placeholder={t("hotels_page.search_city")}
                  className="hotels-input"
                />

                <input
                  type="date"
                  className="hotels-input"
                  placeholder={t("hotels_page.search_checkin")}
                />

                <input
                  type="date"
                  className="hotels-input"
                  placeholder={t("hotels_page.search_checkout")}
                />

                <input
                  type="number"
                  min="1"
                  placeholder={t("hotels_page.search_guests")}
                  className="hotels-input"
                />

                <button className="hotels-btn hotels-btn-primary">
                  {t("hotels_page.search_button")}
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FILTERS + LIST */}
      <section className="hotels-content-section">
        <Container>
          <Row>
            {/* FILTERS */}
            <Col lg={3} className="mb-4">
              <div className="hotels-filter-box">
                <h5 className="hotels-filter-title">
                  {t("hotels_page.filters_title")}
                </h5>

                <div className="hotels-filter-group">
                  <label>{t("hotels_page.filter_price")}</label>
                  <input type="range" className="hotels-range" />
                </div>

                <div className="hotels-filter-group">
                  <label>{t("hotels_page.filter_rating")}</label>
                  <select className="hotels-select">
                    <option>{t("hotels_page.filter_any")}</option>
                    <option>{t("hotels_page.filter_5")}</option>
                    <option>{t("hotels_page.filter_4")}</option>
                    <option>{t("hotels_page.filter_3")}</option>
                  </select>
                </div>

                <div className="hotels-filter-group">
                  <label>{t("hotels_page.filter_location")}</label>
                  <select className="hotels-select">
                    <option>{t("hotels_page.filter_any")}</option>
                    <option>Yerevan</option>
                    <option>Sevan</option>
                    <option>Dilijan</option>
                  </select>
                </div>
              </div>
            </Col>

            {/* HOTELS LIST */}
            <Col lg={9}>
              <Row className="g-4">
                {hotelsItems.map((hotel) => (
                  <Col md={6} key={hotel.id}>
                    <div className="hotel-card">
                      <div className="hotel-card-image"></div>

                      <div className="hotel-card-body">
                        <h5 className="hotel-card-title">
                          {t(`hotels_page.items.${hotel.key}.title`)}
                        </h5>

                        <span className="hotel-card-rating">
                          {hotel.rating}
                        </span>

                        <p className="hotel-card-text">
                          {t(`hotels_page.items.${hotel.key}.description`)}
                        </p>

                        <div className="hotel-card-footer">
                          <span className="hotel-card-price">
                            {t("hotels_page.hotel_price_from", { price: hotel.price })}
                          </span>

                          <button className="hotels-btn hotels-btn-outline">
                            {t("hotels_page.view_details")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* TRUST */}
      <section className="hotels-trust-section">
        <Container>
          <Row className="text-center">
            <Col md={4}>
              <h5>{t("hotels_page.trust_best_price")}</h5>
              <p>{t("hotels_page.trust_no_fees")}</p>
            </Col>

            <Col md={4}>
              <h5>{t("hotels_page.trust_verified")}</h5>
              <p>{t("hotels_page.trust_partners")}</p>
            </Col>

            <Col md={4}>
              <h5>{t("hotels_page.trust_support")}</h5>
              <p>{t("hotels_page.trust_support_text")}</p>
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default HotelsPage;
