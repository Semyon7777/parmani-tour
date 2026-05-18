import React from "react";
import { useTranslation } from "react-i18next";
import "./firstPage.css";
import img1 from "./first page images/cardImg1.webp";
import img2 from "./first page images/cardImg2.webp";
import img3 from "./first page images/cardImg3.webp";
import img4 from "./first page images/cardImg4.webp";
import { Link } from "react-router-dom";

function FirstPageThirdPart() {
  const { t } = useTranslation();

  return (
    <div className="thirdContainer">
      <div className="thirdContainerHeadOfText">
        {t("first_page_cards.section_title")}
      </div>

      <div className="cards">
        <CardComponents />
      </div>
    </div>
  );
}

const Card = ({ title, text, imgSrc, buttonText, buttonLink }) => {
  const { t } = useTranslation();

  return (
    <div className="card m-3" style={{ width: "19rem" }}>
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
  const { i18n } = useTranslation();
  const lang = (i18n.language || 'en').split('-')[0];

  const cardsData = [
    {
      title: "first_page_cards.private_title",
      text: "first_page_cards.private_text",
      imgSrc: img1,
      buttonText: "first_page_cards.private_button",
      buttonLink: `/${lang}/private-tours`,
    },
    {
      title: "first_page_cards.group_eco_title",
      text: "first_page_cards.group_eco_text",
      imgSrc: img2,
      buttonText: "first_page_cards.group_eco_button",
      buttonLink: `/${lang}/group-eco-tours`,
    },
    {
      title: "first_page_cards.school_title",
      text: "first_page_cards.school_text",
      imgSrc: img3,
      buttonText: "first_page_cards.school_button",
      buttonLink: `/${lang}/special?tab=school`,
    },
    {
      title: "first_page_cards.custom_title",
      text: "first_page_cards.custom_text",
      imgSrc: img4,
      buttonText: "first_page_cards.custom_button",
      buttonLink: `/${lang}/special?tab=custom`,
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
