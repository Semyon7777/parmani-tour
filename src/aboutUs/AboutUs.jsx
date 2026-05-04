import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import teamImg from "./images/team.jpg";
import officeImg from "./images/office.jpg";
import "./AboutUs.css";

const stats = [
  { key: "years", value: "8+" },
  { key: "clients", value: "2K+" },
  { key: "tours", value: "50+" },
  { key: "guides", value: "12" },
];

const values = [
  { key: "professionalism", icon: "✦" },
  { key: "trust", icon: "◈" },
  { key: "local", icon: "◉" },
];

function AboutPage() {
  const { t } = useTranslation();
  const sectionsRef = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    sectionsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRef = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <div className="about-page">
      <NavbarCustom />

      {/* HERO */}
      <section className="ab-hero">
        <div className="ab-hero-bg" />
        <div className="ab-hero-inner">
          <span className="ab-hero-label">{t("about.hero.label", "Our Story")}</span>
          <h1 className="ab-hero-title">{t("about.hero.title")}</h1>
          <p className="ab-hero-sub">{t("about.hero.subtitle")}</p>
          <div className="ab-hero-line" />
        </div>
      </section>

      {/* STATS */}
      <section className="ab-stats" ref={addRef}>
        {stats.map((s) => (
          <div className="ab-stat-item fade-up" key={s.key}>
            <span className="ab-stat-value">{s.value}</span>
            <span className="ab-stat-label">{t(`about.stats.${s.key}`)}</span>
          </div>
        ))}
      </section>

      {/* MISSION */}
      <section className="ab-mission" ref={addRef}>
        <div className="ab-mission-img-wrap fade-left">
          <img src={officeImg} alt="Office" className="ab-mission-img" />
          <div className="ab-mission-img-accent" />
        </div>
        <div className="ab-mission-text fade-right">
          <span className="ab-section-label">{t("about.mission.label", "Mission")}</span>
          <h2>{t("about.mission.title")}</h2>
          <p>{t("about.mission.text")}</p>
        </div>
      </section>

      {/* VALUES */}
      <section className="ab-values" ref={addRef}>
        <div className="ab-values-header fade-up">
          <span className="ab-section-label">{t("about.values.label", "What we stand for")}</span>
          <h2>{t("about.values.title")}</h2>
        </div>
        <div className="ab-values-grid">
          {values.map((v, i) => (
            <div className="ab-value-card fade-up" style={{ animationDelay: `${i * 0.15}s` }} key={v.key}>
              <span className="ab-value-icon">{v.icon}</span>
              <h3>{t(`about.values.${v.key}.title`)}</h3>
              <p>{t(`about.values.${v.key}.text`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="ab-team" ref={addRef}>
        <div className="ab-team-text fade-left">
          <span className="ab-section-label">{t("about.team.label", "The people")}</span>
          <h2>{t("about.team.title")}</h2>
          <p>{t("about.team.text")}</p>
        </div>
        <div className="ab-team-img-wrap fade-right">
          <img src={teamImg} alt="Team" className="ab-team-img" />
          <div className="ab-team-img-accent" />
        </div>
      </section>

      {/* CTA */}
      <section className="ab-cta" ref={addRef}>
        <div className="ab-cta-inner fade-up">
          <h2>{t("about.cta.title")}</h2>
          <p>{t("about.cta.text")}</p>
          <a href="/contact" className="ab-cta-btn">{t("about.cta.button", "Get in touch")}</a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default AboutPage;