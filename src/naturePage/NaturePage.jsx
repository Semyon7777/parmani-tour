import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";

// Images
import mountainsImg from "./images/mountains.jpg";
import lakeImg from "./images/lake.jpg";
import forestImg from "./images/forest.jpg";
import canyonImg from "./images/canyon.jpg";
import heroImg from "./images/nature-hero.jpg"; 

import "./NaturePage.css";

const sections = [
  { key: "mountains", img: mountainsImg, tag: "Highlands" },
  { key: "lakes", img: lakeImg, tag: "Waters" },
  { key: "forests", img: forestImg, tag: "Woodlands" },
  { key: "canyons", img: canyonImg, tag: "Gorges" },
];

function NaturePage() {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="nature-page">
      <NavbarCustom />

      {/* HERO: Reduced height for better focus */}
      <section 
        className="nature-hero" 
        style={{ backgroundImage: `linear-gradient(rgba(14, 31, 18, 0.6), rgba(14, 31, 18, 0.9)), url(${heroImg})` }}
      >
        <div className="hero-content-mini">
          <span className="hero-tagline">{t("nature.hero.category", "Wild Armenia")}</span>
          <h1>{t("nature.hero.title")}</h1>
          <p>{t("nature.hero.subtitle")}</p>
        </div>
      </section>

      {/* COMPACT GRID */}
      <section className="nature-grid-container">
        {sections.map((section, index) => (
          <div key={section.key} className="nature-row-refined">
            <div className="nature-col-image">
              <div className="img-container">
                <img src={section.img} alt={section.key} />
                <span className="row-number">0{index + 1}</span>
              </div>
            </div>
            
            <div className="nature-col-text">
              <span className="section-label">{section.tag}</span>
              <h2>{t(`nature.sections.${section.key}.title`)}</h2>
              <div className="divider-sm"></div>
              <p>{t(`nature.sections.${section.key}.text`)}</p>
              <button className="text-link-btn">
                {t("common.discover_more", "Discover More")}
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* CTA: Smaller, more elegant box */}
      <section className="nature-bottom-cta">
        <div className="cta-mini-card">
          <h2>{t("nature.final.title")}</h2>
          <button className="btn-moss">{t("nature.cta.primary", "Plan a Trip")}</button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default NaturePage;