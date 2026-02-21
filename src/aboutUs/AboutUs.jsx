import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import teamImg from "./images/team.jpg";
import officeImg from "./images/office.jpg";
import "./AboutUs.css";

function AboutPage() {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      <NavbarCustom />

      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>{t("about.hero.title")}</h1>
          <p>{t("about.hero.subtitle")}</p>
        </div>
      </section>

      {/* MISSION */}
      <section className="about-mission container">
        <div className="about-mission-text">
          <h2>{t("about.mission.title")}</h2>
          <p>{t("about.mission.text")}</p>
        </div>
        <img src={officeImg} alt="Office" />
      </section>

      {/* VALUES */}
      <section className="about-values">
        <div className="container">
          <h2>{t("about.values.title")}</h2>

          <div className="values-grid">
            <div>
              <h3>{t("about.values.professionalism.title")}</h3>
              <p>{t("about.values.professionalism.text")}</p>
            </div>

            <div>
              <h3>{t("about.values.trust.title")}</h3>
              <p>{t("about.values.trust.text")}</p>
            </div>

            <div>
              <h3>{t("about.values.local.title")}</h3>
              <p>{t("about.values.local.text")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="about-team container">
        <img src={teamImg} alt="Team" />
        <div className="about-team-text">
          <h2>{t("about.team.title")}</h2>
          <p>{t("about.team.text")}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <h2>{t("about.cta.title")}</h2>
        <p>{t("about.cta.text")}</p>
      </section>

      <Footer />
    </div>
  );
}

export default AboutPage;
