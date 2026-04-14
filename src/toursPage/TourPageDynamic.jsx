import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { supabase } from "../supabaseClient"; // Убедись, что путь верный
import NavbarCustom from "../Components/Navbar";
import TourInfo from "../Components/TourInfo";
import Footer from "../Components/Footer";
import toursData from "./toursData.json";
import { getCached, setCache } from "../utils/tourCache";

function TourPageDynamic() {
  const { tourId } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  // Состояние для данных из библиотеки мест
  const [dbPlaces, setDbPlaces] = useState([]);

  const lang = (i18n.language || "en").split('-')[0];

  // Ищем базовую инфу в JSON
  const tour = toursData.find(item => item.id === tourId);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchLibraryData = async () => {

      // 1. Пытаемся взять данные из кэша
      const cacheKey = `tour_places_${tourId}`;
      const cachedData = getCached(cacheKey);

      if (cachedData) {
        setDbPlaces(cachedData);
        return; // Выходим из функции, если данные в кэше найдены
      }

      try {
        const { data, error } = await supabase
          .from('locations_library')
          .select('*')
          .in('place_id', tour.itineraryIds);

        if (error) throw error;

        // Сортируем данные согласно порядку ID в JSON
        const sortedData = tour.itineraryIds.map(id => 
          data.find(item => item.place_id === id)
        ).filter(Boolean);

        // 3. Сохраняем результат в кэш и в стейт
        setDbPlaces(sortedData);
        setCache(cacheKey, sortedData); 

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
        <button onClick={() => navigate('/private-tours')}>Back to Tours</button>
      </div>
    );
  }

  // Related tours (остаются локальными)
  const relatedToursFormatted = toursData
    .filter(item => item.id !== tourId)
    .slice(0, 4)
    .map(rel => ({
      id: rel.id,
      title: rel.title[lang],
      image: rel.imageUrl,
      price: rel.price
    }));

  // Формируем итоговый объект
  const myTourData = {
    id: tour.id,
    title: tour.title[lang],
    duration: tour.duration,
    image: tour.imageUrl,
    routeMap: tour.routeMap,
    durationUnit: tour.durationUnit,
    price: tour.price,
    altText: tour.title[lang],
    buttonText: t('bookNow', 'Book Now'),
    
    // Сюда попадают данные, "склеенные" из базы
    // Внутри формирования myTourData
    sections: dbPlaces.map((place) => ({
      day: 1, 
      header: place.header[lang],
      content: place.content[lang],
      fullContent: place.full_content ? place.full_content[lang] : null,
      // Теперь передаем массив images
      image: place.images 
    })),
    

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