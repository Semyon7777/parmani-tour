import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./AboutUs.css";

import SEO from "../Components/SEO";

// const stats = [
//   { key: "years", value: "8+" },
//   { key: "clients", value: "2K+" },
//   { key: "tours", value: "50+" },
//   { key: "guides", value: "12" },
// ];

const values = [
  { key: "professionalism", icon: "✦" },
  { key: "trust", icon: "◈" },
  { key: "local", icon: "◉" },
];

function AboutPage() {
  const { t, i18n } = useTranslation();
  const sectionsRef = useRef([]);
  const lang = (i18n.language || 'en').split('-')[0];

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
      <SEO
        title="About Us"
        description="Learn about Parmani Tour — our team, mission and passion for Armenian tourism. We create unforgettable experiences."
        url="/about-us"
        lang={lang}
        schema={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Parmani Tour",
          "description": "Learn about Parmani Tour",
          "url": "https://www.parmanitour.com/about-us"
        }}
      />

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
      {/* <section className="ab-stats" ref={addRef}>
        {stats.map((s) => (
          <div className="ab-stat-item fade-up" key={s.key}>
            <span className="ab-stat-value">{s.value}</span>
            <span className="ab-stat-label">{t(`about.stats.${s.key}`)}</span>
          </div>
        ))}
      </section> */}

      {/* MISSION */}
      <section className="ab-mission" ref={addRef}>
        <div className="ab-mission-img-wrap fade-left">
          <img src="https://res.cloudinary.com/dwqsqiezw/image/upload/v1780267710/hsffs_t3q2bf.webp" alt="Office" className="ab-mission-img" />
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
          <img src="https://res.cloudinary.com/dwqsqiezw/image/upload/v1780267499/shfl_ulbfjy.webp" alt="Team" className="ab-team-img" />
          <div className="ab-team-img-accent" />
        </div>
      </section>

      {/* CTA */}
      <section className="ab-cta" ref={addRef}>
        <div className="ab-cta-inner fade-up">
          <h2>{t("about.cta.title")}</h2>
          <p>{t("about.cta.text")}</p>
          <a href={`/${lang}/contact`} className="ab-cta-btn">{t("about.cta.button", "Get in touch")}</a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default AboutPage;