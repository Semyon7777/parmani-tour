import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./HistoryPage.css";

import heroImg from "./images/history-hero.png";

function HistoryPage() {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const timeline = [
    {
      year: t("history_page.timeline.urartu.year"),
      title: t("history_page.timeline.urartu.title"),
      text: t("history_page.timeline.urartu.text"),
      img: "https://res.cloudinary.com/dwqsqiezw/image/upload/w_900,c_fill,f_auto,q_auto/v1773330469/urartu_yqmban.png"
    },
    {
      year: t("history_page.timeline.urartu.year"),
      title: t("history_page.timeline.christianity.title"),
      text: t("history_page.timeline.christianity.text"),
      img: "https://res.cloudinary.com/dwqsqiezw/image/upload/w_900,c_fill,f_auto,q_auto/v1773330514/christianity_jc7zii.jpg"
    },
    {
      year: t("history_page.timeline.urartu.year"),
      title: t("history_page.timeline.medieval.title"),
      text: t("history_page.timeline.medieval.text"),
      img: "https://res.cloudinary.com/dwqsqiezw/image/upload/w_900,c_fill,f_auto,q_auto/v1773330537/medieval_phajwo.jpg"
    },
    {
      year: t("history_page.timeline.urartu.year"),
      title: t("history_page.timeline.modern.title"),
      text: t("history_page.timeline.modern.text"),
      img: "https://res.cloudinary.com/dwqsqiezw/image/upload/w_900,c_fill,f_auto,q_auto/v1773330546/modern_m35m1r.jpg"
    },
  ];

  return (
    <div className="history-page">

        <NavbarCustom />

      {/* HERO */}
      <section
        className="history-hero"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="history-hero-overlay">
          <h1>{t("history_page.hero.title")}</h1>
          <p>{t("history_page.hero.subtitle")}</p>
        </div>
      </section>

      {/* INTRO */}
      <section className="history-intro">
        <Container>
          <h2 className="history-section-title">
            {t("history_page.intro.title")}
          </h2>
          <p className="history-section-text">
            {t("history_page.intro.text")}
          </p>
        </Container>
      </section>

      {/* TIMELINE */}
      <section className="history-timeline">
        <Container>
          {timeline.map((item, index) => (
            <Row
              key={index}
              className={`history-row align-items-center ${
                index % 2 !== 0 ? "flex-lg-row-reverse" : ""
              }`}
            >
              <Col lg={6}>
                <div className="history-image-wrapper">
                  <img src={item.img} alt={item.title} />
                </div>
              </Col>

              <Col lg={6}>
                <div className="history-content">
                  <span className="history-year">{item.year}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </Col>
            </Row>
          ))}
        </Container>
      </section>

      <Footer />

    </div>
  );
}

export default HistoryPage;
