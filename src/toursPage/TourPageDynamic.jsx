import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { supabase } from "../supabaseClient";
import NavbarCustom from "../Components/Navbar";
import TourInfo from "../Components/TourInfo";
import Footer from "../Components/Footer";
import toursData from "./toursData.json";
import { getCached, setCache } from "../utils/tourCache";

function TourPageDynamic() {
  const { tourId } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  // Состояние для сырых данных из Supabase
  const [dbPlaces, setDbPlaces] = useState([]);

  const lang = (i18n.language || "en").split('-')[0];

  // Ищем тур в JSON
  const tour = toursData.find(item => item.id === tourId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (!tour) return;

    const fetchLibraryData = async () => {
      const cacheKey = `tour_places_${tourId}`;
      const cachedData = getCached(cacheKey);

      if (cachedData) {
        setDbPlaces(cachedData);
        return;
      }

      try {
        // Определяем все нужные ID в зависимости от структуры тура
        const allIds = tour.itinerary 
          ? tour.itinerary.flatMap(dayItem => dayItem.ids) 
          : (tour.itineraryIds || []);

        if (allIds.length === 0) return;

        const { data, error } = await supabase
          .from('locations_library')
          .select('*')
          .in('place_id', allIds);

        if (error) throw error;

        // Сохраняем результат (порядок восстановим при маппинге ниже)
        setDbPlaces(data);
        setCache(cacheKey, data); 

      } catch (err) {
        console.error("Error fetching locations library:", err.message);
      } 
    };

    fetchLibraryData();
  }, [tourId, tour]);

  if (!tour) {
    return (
      <div className="text-center py-5">
        <h2>Tour not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/private-tours')}>
          Back to Tours
        </button>
      </div>
    );
  }

  // --- Формирование секций маршрута (itinerary) ---
  let finalSections = [];

  if (tour.itinerary) {
    // 1. Логика для МНОГОДНЕВНОГО тура
    finalSections = tour.itinerary.flatMap((dayGroup) => {
      return dayGroup.ids.map(id => {
        const place = dbPlaces.find(p => p.place_id === id);
        if (!place) return null;
        return {
          day: dayGroup.day,
          header: place.header[lang] || "",
          content: place.content[lang] || "",
          fullContent: place.full_content ? place.full_content[lang] : null,
          image: place.images 
        };
      }).filter(Boolean);
    });
  } else if (tour.itineraryIds) {
    // 2. Логика для ОДНОДНЕВНОГО тура
    finalSections = tour.itineraryIds.map((id) => {
      const place = dbPlaces.find(p => p.place_id === id);
      if (!place) return null;
      return {
        day: 1, // Всегда 1 день
        header: place.header[lang] || "",
        content: place.content[lang] || "",
        fullContent: place.full_content ? place.full_content[lang] : null,
        image: place.images 
      };
    }).filter(Boolean);
  }

  // Похожие туры
  const relatedToursFormatted = toursData
    .filter(item => item.id !== tourId)
    .slice(0, 4)
    .map(rel => ({
      id: rel.id,
      title: rel.title[lang],
      image: rel.imageUrl,
      price: rel.price
    }));

  // Собираем итоговый объект для компонента TourInfo
  const myTourData = {
    ...tour,
    title: tour.title[lang],
    duration: tour.duration,
    image: tour.imageUrl,
    routeMap: tour.routeMap,
    durationUnit: tour.durationUnit,
    price: tour.price,
    altText: tour.title[lang],
    buttonText: t('bookNow', 'Book Now'),
    sections: finalSections,
    carouselInfo: tour.carousel,
    include: [
      { 
        title: t('tourDetails', 'Tour Details'), 
        featuresInclude: tour.features.include[lang], 
        featuresNotInclude: tour.features.exclude[lang] 
      }
    ],
    relatedTours: relatedToursFormatted
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