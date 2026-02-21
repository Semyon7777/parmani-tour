import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./transportPage.css";

const TransportPage = () => {
  const { t } = useTranslation();

  React.useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  return (
    <div className="transport-container">
      <NavbarCustom />

      {/* HERO SECTION */}
      <section className="transport-hero-section">
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col lg={7}>
              <h1 className="transport-hero-title">
                {t("transport_page.hero_title")}
              </h1>

              <p className="transport-hero-subtitle">
                {t("transport_page.hero_subtitle")}
              </p>

              <div className="transport-hero-buttons">
                <button className="transport-btn transport-btn-primary me-3">
                  {t("transport_page.book_transfer")}
                </button>

                <button className="transport-btn transport-btn-outline">
                  {t("transport_page.contact_us")}
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* SERVICES */}
      <section className="transport-services-section">
        <Container>
          <div className="text-center mb-5">
            <h2 className="transport-section-title">
              {t("transport_page.services_title")}
            </h2>
            <p className="transport-section-subtitle">
              {t("transport_page.services_subtitle")}
            </p>
          </div>

          <Row className="g-4">
            <Col md={6} lg={3}>
              <div className="transport-service-card">
                <h5>{t("transport_page.services.taxi_title")}</h5>
                <p>{t("transport_page.services.taxi_desc")}</p>
              </div>
            </Col>

            <Col md={6} lg={3}>
              <div className="transport-service-card">
                <h5>{t("transport_page.services.airport_title")}</h5>
                <p>{t("transport_page.services.airport_desc")}</p>
              </div>
            </Col>

            <Col md={6} lg={3}>
              <div className="transport-service-card">
                <h5>{t("transport_page.services.city_title")}</h5>
                <p>{t("transport_page.services.city_desc")}</p>
              </div>
            </Col>

            <Col md={6} lg={3}>
              <div className="transport-service-card">
                <h5>{t("transport_page.services.custom_title")}</h5>
                <p>{t("transport_page.services.custom_desc")}</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* POPULAR ROUTES */}
      <section className="transport-routes-section">
        <Container>
          <h2 className="transport-section-title text-center mb-5">
            {t("transport_page.routes_title")}
          </h2>

          <Row className="g-4">
            <Col md={4}>
              <div className="transport-route-card">
                <h6>{t("transport_page.routes.airport_yerevan")}</h6>
                <span>{t("transport_page.routes.available")}</span>
              </div>
            </Col>

            <Col md={4}>
              <div className="transport-route-card">
                <h6>{t("transport_page.routes.yerevan_sevan")}</h6>
                <span>{t("transport_page.routes.lake")}</span>
              </div>
            </Col>

            <Col md={4}>
              <div className="transport-route-card">
                <h6>{t("transport_page.routes.yerevan_dilijan")}</h6>
                <span>{t("transport_page.routes.mountains")}</span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA */}
      <section className="transport-cta-section">
        <Container className="text-center">
          <h2 className="transport-cta-title">
            {t("transport_page.cta_title")}
          </h2>
          <p className="transport-cta-text">
            {t("transport_page.cta_text")}
          </p>

          <button className="transport-btn transport-btn-primary">
            {t("transport_page.book_now")}
          </button>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default TransportPage;
