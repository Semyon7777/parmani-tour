import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import SEO from "../Components/SEO";
import extremeToursData from "./extremeToursData.json";
import "./ExtremePage.css";

const difficultyColor = {
  easy:   { bg: "#e8f5e9", color: "#22c55e", label: "easy" },
  medium: { bg: "#fff8e1", color: "#f59e0b", label: "medium" },
  hard:   { bg: "#fdecea", color: "#ef4444", label: "hard" },
};

function ExtremePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");

  const lang = (i18n.language || "en").split("-")[0];

  const filters = [
    { key: "all",    label: t("extreme.all") },
    { key: "summer", label: t("extreme.summer") },
    { key: "winter", label: t("extreme.winter") },
  ];

  const filtered = useMemo(() => {
    if (activeFilter === "all") return extremeToursData;
    return extremeToursData.filter(tour =>
      tour.season.includes(activeFilter)
    );
  }, [activeFilter]);

  return (
    <div className="extreme-page">
      <SEO
        title={t("extreme.title")}
        description={t("extreme.subtitle")}
        url="/extreme-tours"
      />
      <NavbarCustom />

      {/* Hero */}
      <div className="extreme-hero">
        <div className="extreme-hero-content">
          <h1>{t("extreme.title")}</h1>
          <p>{t("extreme.subtitle")}</p>
        </div>
      </div>

      {/* Фильтры */}
      <div className="extreme-filters">
        {filters.map(f => (
          <button
            key={f.key}
            className={`extreme-filter-btn ${activeFilter === f.key ? "active" : ""}`}
            onClick={() => setActiveFilter(f.key)}
          >
            {f.key === "all"    && "🏔 "}
            {f.key === "summer" && "☀️ "}
            {f.key === "winter" && "❄️ "}
            {f.label}
          </button>
        ))}
      </div>

      {/* Карточки */}
      <div className="extreme-grid">
        {filtered.map(tour => (
          <div key={tour.id} className="extreme-card">

            {/* Картинка */}
            <div className="extreme-card-image">
              <img src={tour.imageUrl} alt={tour.title[lang]} loading="lazy" />
              {/* Бейдж сложности */}
              <span
                className="extreme-difficulty-badge"
                style={{
                  background: difficultyColor[tour.difficulty]?.bg,
                  color: difficultyColor[tour.difficulty]?.color
                }}
              >
                {t(`extreme.${tour.difficulty}`)}
              </span>
              {/* Бейджи сезона */}
              <div className="extreme-season-badges">
                {tour.season.map(s => (
                  <span key={s} className="extreme-season-badge">
                    {s === "summer" ? "☀️" : s === "winter" ? "❄️" : "🍂"}
                  </span>
                ))}
              </div>
            </div>

            {/* Контент */}
            <div className="extreme-card-body">
              <h3 className="extreme-card-title">{tour.title[lang]}</h3>
              <p className="extreme-card-desc">{tour.description[lang]}</p>

              <div className="extreme-card-meta">
                <div className="extreme-meta-row">
                  <span className="extreme-meta-label">⏱ {t("extreme.duration")}</span>
                  <span>{tour.duration[lang]}</span>
                </div>
                <div className="extreme-meta-row">
                  <span className="extreme-meta-label">💰 {t("extreme.price")}</span>
                  <span className="extreme-price">{tour.price[lang]}</span>
                </div>
              </div>

              {/* Включено */}
              <div className="extreme-includes">
                <div className="extreme-includes-label">✅ {t("extreme.includes")}</div>
                <ul>
                  {tour.includes[lang].map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Кнопка */}
              <button
                className="extreme-contact-btn"
                onClick={() => navigate("/contact")}
              >
                {t("extreme.contact")}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}

export default ExtremePage;