import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";

import khorovatsImg from "./images/khorovats.jpg";
import lavashImg from "./images/lavash.jpg";
import dolmaImg from "./images/dolma.jpg";
import gataImg from "./images/gata.jpg";
import heroImg from "./images/cuisine-hero.webp";

import "./CuisinePage.css";

const dishes = [
  { key: "khorovats", img: khorovatsImg, labelKey: "cuisine.dishes.khorovats.label" },
  { key: "lavash",    img: lavashImg,    labelKey: "cuisine.dishes.lavash.label" },
  { key: "dolma",     img: dolmaImg,     labelKey: "cuisine.dishes.dolma.label" },
  { key: "gata",      img: gataImg,      labelKey: "cuisine.dishes.gata.label" },
];

// ─── Хук для анимации появления при скролле ──────────────────
function useFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function FadeIn({ children, className = "", delay = 0 }) {
  const [ref, visible] = useFadeIn();
  return (
    <div
      ref={ref}
      className={`fade-block ${visible ? "fade-block--visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function CuisinePage() {
  const { t } = useTranslation();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const facts = [
    { num: "3 000+", key: "cuisine.facts.f1" },
    { num: "UNESCO", key: "cuisine.facts.f2" },
    { num: "40+",    key: "cuisine.facts.f3" },
    { num: "12",     key: "cuisine.facts.f4" },
  ];

  const traditions = [
    { icon: "🌿", key: "cuisine.traditions.t1" },
    { icon: "🍷", key: "cuisine.traditions.t2" },
    { icon: "🫓", key: "cuisine.traditions.t3" },
    { icon: "🏺", key: "cuisine.traditions.t4" },
    { icon: "👨‍👩‍👧", key: "cuisine.traditions.t5" },
    { icon: "🔥", key: "cuisine.traditions.t6" },
  ];

  return (
    <div className="cuisine-page">
      <NavbarCustom />

      {/* ── HERO ── */}
      <section className="cuisine-hero-editorial">
        <div className="hero-bg-wrapper">
          <img src={heroImg} alt="Armenian Table" className="hero-parallax-img" loading="eager" />
          <div className="hero-overlay-gradient" />
        </div>
        <div className="hero-content">
          <span className="hero-subtitle">{t("cuisine.hero.tag", "A Culinary Heritage")}</span>
          <h1>{t("cuisine.hero.title")}</h1>
          <p className="hero-desc">{t("cuisine.hero.desc", "Thousands of years of flavour, tradition and hospitality")}</p>
        </div>
      </section>

      {/* ── FACTS BAR ── */}
      <section className="cuisine-facts-bar">
        {facts.map((f, i) => (
          <div key={i} className="fact-item">
            <span className="fact-num">{f.num}</span>
            <span className="fact-label">{t(f.key)}</span>
          </div>
        ))}
      </section>

      {/* ── INTRO ── */}
      <section className="cuisine-intro-refined">
        <FadeIn className="intro-container">
          <p>{t("cuisine.intro.text")}</p>
        </FadeIn>
      </section>

      {/* ── QUOTE ── */}
      <section className="cuisine-quote-section">
        <FadeIn>
          <blockquote className="armenian-quote">
            <span className="quote-mark">"</span>
            {t("cuisine.quote.text", "The table is the place where friendships are born and souls are fed.")}
            <cite>{t("cuisine.quote.author", "— Armenian proverb")}</cite>
          </blockquote>
        </FadeIn>
      </section>

      {/* ── EDITORIAL DISHES ── */}
      <section className="cuisine-feature-grid">
        {dishes.map((dish, index) => (
          <FadeIn key={dish.key} className={`feature-row ${index % 2 !== 0 ? "row-reverse" : ""}`}>
            <div className="feature-image-block">
              <div className="image-frame">
                <img src={dish.img} alt={dish.key} loading="lazy" />
                <div className="image-border-deco" />
              </div>
            </div>
            <div className="feature-text-block">
              <span className="dish-label">{t(dish.labelKey)}</span>
              <h2>{t(`cuisine.dishes.${dish.key}.title`)}</h2>
              <p>{t(`cuisine.dishes.${dish.key}.text`)}</p>
            </div>
          </FadeIn>
        ))}
      </section>

      {/* ── TRADITIONS ── */}
      <section className="cuisine-traditions-section">
        <FadeIn>
          <div className="traditions-header">
            <span className="section-eyebrow">{t("cuisine.traditions.eyebrow", "Culture & Customs")}</span>
            <h2>{t("cuisine.traditions.title", "Food as a Way of Life")}</h2>
            <p>{t("cuisine.traditions.subtitle", "Armenian cuisine is more than recipes — it is a living tradition passed through generations.")}</p>
          </div>
        </FadeIn>
        <div className="traditions-grid">
          {traditions.map((tr, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div className="tradition-card">
                <span className="tradition-icon">{tr.icon}</span>
                <p>{t(tr.key)}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── TOUR CTA ── */}
      <section className="cuisine-tour-cta">
        <FadeIn>
          <div className="tour-cta-inner">
            <div className="tour-cta-text">
              <span className="section-eyebrow">{t("cuisine.tour_cta.eyebrow", "Taste it yourself")}</span>
              <h2>{t("cuisine.tour_cta.title", "Explore Armenian Cuisine on a Gastronomic Tour")}</h2>
              <p>{t("cuisine.tour_cta.text", "Visit local markets, taste traditional dishes and learn recipes from Armenian families.")}</p>
            </div>
            <Link to="/private-tours?cat=gastronomic&page=1" className="cuisine-tour-btn">
              {t("cuisine.tour_cta.btn", "View Gastronomic Tours")}
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="cuisine-footer-cta">
        <FadeIn>
          <div className="cta-content">
            <h2>{t("cuisine.experience.title")}</h2>
            <p>{t("cuisine.experience.text")}</p>
          </div>
        </FadeIn>
      </section>

      <Footer />
    </div>
  );
}

export default CuisinePage;