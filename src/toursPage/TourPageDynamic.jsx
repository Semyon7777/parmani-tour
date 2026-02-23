import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import NavbarCustom from "../Components/Navbar";
import TourInfo from "../Components/TourInfo";
import Footer from "../Components/Footer";
import toursData from "./toursData.json";

function TourPageDynamic() {
  const { tourId } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language || "en";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tourId]);

  const tour = toursData.find(item => item.id === tourId);

  if (!tour) {
    return (
      <div className="text-center py-5">
        <h2>Tour not found</h2>
        <button onClick={() => navigate('/tours')}>Back to Tours</button>
      </div>
    );
  }

  // Формируем объект для твоего компонента TourInfo
  const myTourData = {
    id: tour.id,
    title: tour.title[lang],
    duration: tour.duration,
    image: tour.imageUrl,
    routeMap: tour.routeMap, // Передаем карту
    price: tour.price,       // Передаем цену
    altText: tour.title[lang],
    buttonText: t('bookNow', 'Book Now'),
    
    // Обновленный маппинг для поддержки "Read More" и картинок
    sections: tour.sections.map(sec => ({
      header: sec.header[lang],
      content: sec.content[lang],
      fullContent: sec.fullContent ? sec.fullContent[lang] : null, // Добавили это
      image: sec.image // Добавили это
    })),

    carouselInfo: tour.carousel,
    include: [
      { 
        title: t('tourDetails', 'Tour Details'), 
        featuresInclude: tour.features.include[lang], 
        featuresNotInclude: tour.features.exclude[lang] 
      }
    ]
  };

  return (
    <div className="tour-dynamic-page">
      <NavbarCustom />
      <TourInfo tourData={myTourData} />
      <Footer />
    </div>
  );
}

export default TourPageDynamic;