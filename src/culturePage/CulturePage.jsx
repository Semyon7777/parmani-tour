import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import danceImg from "./images/dance.jpg";
import carpetImg from "./images/carpet.jpg";
import monasteryImg from "./images/monastery.jpg";
import manuscriptImg from "./images/manuscript.jpg";
import "./CulturePage.css";

function CulturePage() {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="culture-page">
      <NavbarCustom />

      {/* HERO */}
      <section className="culture-hero">
        <div className="culture-hero-content">
          <h1>{t("culture.hero.title")}</h1>
          <p>{t("culture.hero.subtitle")}</p>
        </div>
      </section>

      {/* SECTION 1 */}
      <section className="culture-section">
        <div className="culture-container reverse">
          <img src={danceImg} alt="Dance" />
          <div className="culture-text">
            <h2>{t("culture.sections.dance.title")}</h2>
            <p>{t("culture.sections.dance.text")}</p>
          </div>
        </div>
      </section>

      {/* SECTION 2 */}
      <section className="culture-section light">
        <div className="culture-container">
          <img src={carpetImg} alt="Carpet" />
          <div className="culture-text">
            <h2>{t("culture.sections.crafts.title")}</h2>
            <p>{t("culture.sections.crafts.text")}</p>
          </div>
        </div>
      </section>

      {/* SECTION 3 */}
      <section className="culture-section">
        <div className="culture-container reverse">
          <img src={monasteryImg} alt="Monastery" />
          <div className="culture-text">
            <h2>{t("culture.sections.architecture.title")}</h2>
            <p>{t("culture.sections.architecture.text")}</p>
          </div>
        </div>
      </section>

      {/* SECTION 4 */}
      <section className="culture-section light">
        <div className="culture-container">
          <img src={manuscriptImg} alt="Manuscript" />
          <div className="culture-text">
            <h2>{t("culture.sections.art.title")}</h2>
            <p>{t("culture.sections.art.text")}</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default CulturePage;
