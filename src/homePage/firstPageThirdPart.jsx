import React from "react";
import { useTranslation } from "react-i18next";
import "./firstPage.css";
import img1 from "./first page images/cardImg1.webp";
import img2 from "./first page images/cardImg2.webp";
import img3 from "./first page images/cardImg3.webp";
import img4 from "./first page images/cardImg4.webp";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

function FirstPageThirdPart() {
  const { t, i18n } = useTranslation();

  return (
    <div className="thirdContainer">
      <div className="thirdContainerHeadOfText">
        {t("first_page_cards.section_title")}
      </div>

      <div className="cards">
        <CardComponents />
      </div>

      <div className="EndbtnContainer" style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
        <Link to="/services">
          <Button
            variant="hided"
            className={`EndbtnContainerButton ${
              i18n.language === "hy" || i18n.language === "ru"
                ? "EndbtnContainerButton-ru-hy"
                : ""
            }`}
          >
          </Button>
        </Link>
      </div>
    </div>
  );
}

const Card = ({ title, text, imgSrc, buttonText, buttonLink }) => {
  const { t } = useTranslation();

  return (
    <div className="card m-3" style={{ width: "18rem" }}>
      <img src={imgSrc} className="card-img-top" alt={t(title)} loading="lazy"/>
      <div className="card-body">
        <h5 className="card-title">{t(title)}</h5>
        <p className="card-text">{t(text)}</p>
        <Link
          to={buttonLink}
          className="btn btn-success"
          style={{ borderRadius: "1rem" }}
        >
          {t(buttonText)}
        </Link>
      </div>
    </div>
  );
};

function CardComponents() {
  const cardsData = [
    {
      title: "first_page_cards.tours_title",
      text: "first_page_cards.tours_text",
      imgSrc: img1,
      buttonText: "first_page_cards.tours_button",
      buttonLink: "/tours",
    },
    {
      title: "first_page_cards.transfer_title",
      text: "first_page_cards.transfer_text",
      imgSrc: img2,
      buttonText: "first_page_cards.transfer_button",
      buttonLink: "/transport",
    },
    {
      title: "first_page_cards.hotels_title",
      text: "first_page_cards.hotels_text",
      imgSrc: img3,
      buttonText: "first_page_cards.hotels_button",
      buttonLink: "/hotels",
    },
    {
      title: "first_page_cards.custom_title",
      text: "first_page_cards.custom_text",
      imgSrc: img4,
      buttonText: "first_page_cards.custom_button",
      buttonLink: "/all-in-one",
    },
  ];

  return (
    <div className="d-flex flex-wrap justify-content-around">
      {cardsData.map((card, index) => (
        <Card key={index} {...card} />
      ))}
    </div>
  );
}

export default FirstPageThirdPart;
