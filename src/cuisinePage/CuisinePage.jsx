import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";

import khorovatsImg from "./images/khorovats.jpg";
import lavashImg from "./images/lavash.jpg";
import dolmaImg from "./images/dolma.jpg";
import gataImg from "./images/gata.jpg";
import heroImg from "./images/cuisine-hero.webp";

import "./CuisinePage.css";

const dishes = [
  { key: "khorovats", img: khorovatsImg, label: "The Grill" },
  { key: "lavash", img: lavashImg, label: "The Bread" },
  { key: "dolma", img: dolmaImg, label: "The Classic" },
  { key: "gata", img: gataImg, label: "The Sweet" },
];

function CuisinePage() {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="cuisine-page">
      <NavbarCustom />

      {/* HERO: Immersive but not infinite */}
      <section className="cuisine-hero-editorial">
        <div className="hero-bg-wrapper">
          <img src={heroImg} alt="Armenian Table" className="hero-parallax-img" />
          <div className="hero-overlay-gradient"></div>
        </div>
        <div className="hero-content">
          <span className="hero-subtitle">{t("cuisine.hero.tag", "A Culinary Heritage")}</span>
          <h1>{t("cuisine.hero.title")}</h1>
        </div>
      </section>

      {/* INTRO: Elegant spacing */}
      <section className="cuisine-intro-refined">
        <div className="intro-container">
          <p>{t("cuisine.intro.text")}</p>
        </div>
      </section>

      {/* EDITORIAL GRID: Large images, smart spacing */}
      <section className="cuisine-feature-grid">
        {dishes.map((dish, index) => (
          <div key={dish.key} className={`feature-row ${index % 2 === 0 ? "" : "row-reverse"}`}>
            <div className="feature-image-block">
              <div className="image-frame">
                <img src={dish.img} alt={dish.key} />
                <div className="image-border-deco"></div>
              </div>
            </div>
            <div className="feature-text-block">
              <span className="dish-label">{dish.label}</span>
              <h2>{t(`cuisine.dishes.${dish.key}.title`)}</h2>
              <p>{t(`cuisine.dishes.${dish.key}.text`)}</p>
            </div>
          </div>
        ))}
      </section>

      {/* FINAL CALL: Dark Green & Minimal */}
      <section className="cuisine-footer-cta">
        <div className="cta-content">
          <h2>{t("cuisine.experience.title")}</h2>
          <p>{t("cuisine.experience.text")}</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default CuisinePage;