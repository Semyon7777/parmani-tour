import React, { useEffect, useRef, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { useTranslation } from 'react-i18next'; // Импортируйте useTranslation
import img1 from "./first page images/slide1.jpg";
import img2 from "./first page images/slide2.png";
import img3 from "./first page images/slide3.png";
import img4 from "./first page images/slide4.png";
import planeToArmenia from "./first page images/planeToArmenia .jpeg";

import "./firstPage.css";

function FirstPageSecondPart() {
  const { t, i18n:i18n2 } = useTranslation(); // Используйте useTranslation
  const [isVisible, setIsVisible] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const currentTextRef = textRef.current; // Копируем значение ссылки в переменную

    if (currentTextRef) {
      observer.observe(currentTextRef);
    }

    return () => {
      if (currentTextRef) {
        observer.unobserve(currentTextRef);
      }
    };
  }, []);

  return (
    <div className="carouselContainer">
      <div
        className={`carouselContainerHeadText ${isVisible ? "fade-in" : ""}`}
        ref={textRef}
      >
        <span className={`headline ${i18n2.language === 'hy' ? 'headline-ru-hy' : ''}`}>{t('your_opportunities')}</span>
        <span className={`headline ${i18n2.language === 'hy' ? 'headline-ru-hy' : ''}`}>{t('while_traveling_in_armenia')}</span>
        <br />
        <span className={`subHeadline ${i18n2.language === 'hy' || i18n2.language === 'ru' ? 'subHeadline-ru-hy' : ''}`}>{t('sub_headline')}</span>
      </div>
      <div className="carouselArea">
        <UncontrolledExample />
      </div>
      <div className="planeToArmenia">
        <img src={planeToArmenia} alt={t('plane_to_armenia_alt')} className="planeToArmeniaPhoto" style={{ maxWidth: "100%" }} loading="lazy"/>
      </div>
    </div>
  );
}

function UncontrolledExample() {
  const { t } = useTranslation(); // Используйте useTranslation
  const carouselItems = [
    { imgSrc: img1, title: t('first_page_slides.first_slide_title'), description: t('first_page_slides.first_slide_description') },
    { imgSrc: img2, title: t('first_page_slides.second_slide_title'), description: t('first_page_slides.second_slide_description') },
    { imgSrc: img3, title: t('first_page_slides.third_slide_title'), description: t('first_page_slides.third_slide_description') },
    { imgSrc: img4, title: t('first_page_slides.fourth_slide_title'), description: t('first_page_slides.fourth_slide_description') },
  ];

  return (
    <Carousel indicators={false} interval={3000}>
      {carouselItems.map((item, index) => (
        <Carousel.Item key={index}>
          <img className="d-block w-100" src={item.imgSrc} alt={`Slide ${index + 1}`} />
          <Carousel.Caption>
            <h3 className="firstPageCarouselCaptionTitle">{item.title}</h3>
            <p className="firstPageCarouselCaptionInfo">{item.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default FirstPageSecondPart;
