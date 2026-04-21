import React, { useEffect, useState, useMemo } from "react";
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

  const [dbPlaces, setDbPlaces] = useState([]);
  const [tourMeta, setTourMeta] = useState(null);

  const lang = (i18n.language || "en").split('-')[0];
  const tour = useMemo(
    () => toursData.find(item => item.id === tourId),
    [tourId]
  );

  // Определяем тип тура сразу
  const isMultiDay = useMemo(() => Boolean(tourMeta?.itinerary), [tourMeta]);

  // --- Эффект 1: Загружаем features + itinerary_ids из Supabase ---
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (!tour) return;

    const fetchMeta = async () => {
      const metaCacheKey = `tour_meta_${tourId}`;
      const cachedMeta = getCached(metaCacheKey);

      if (cachedMeta) {
        setTourMeta(cachedMeta);
        return;
      }

      const { data, error } = await supabase
        .from('private_tours')
        .select('itinerary_ids, itinerary, features')
        .eq('id', tourId)
        .single();

      if (!error && data) {
        setTourMeta(data);
        setCache(metaCacheKey, data);
      }
    };

    fetchMeta();
  }, [tourId, tour]);

  // --- Эффект 2: Загружаем места ---
  // Многодневный: ids из локального JSON, не ждём tourMeta
  // Однодневный: ids из tourMeta, ждём его
  useEffect(() => {
    if (!tour) return;

    const allIds = isMultiDay
      ? tourMeta?.itinerary?.flatMap(d => d.ids)  // ❌ tourMeta может быть null здесь
      : tourMeta?.itinerary_ids;            // из Supabase

    if (!allIds || allIds.length === 0) return;

    const fetchPlaces = async () => {
      const cacheKey = `tour_places_${tourId}`;
      const cachedData = getCached(cacheKey);

      if (cachedData) {
        setDbPlaces(cachedData);
        return;
      }

      const { data, error } = await supabase
        .from('locations_library')
        .select('*')
        .in('place_id', allIds);

      if (!error && data) {
        setDbPlaces(data);
        setCache(cacheKey, data);
      }
    };

    fetchPlaces();
  }, [tourId, tour, isMultiDay, tourMeta?.itinerary_ids, tourMeta?.itinerary]);
  //                        ^^^^^^^^^^^^^^^^^^^^^^^^^^
  // для многодневных это undefined — эффект сработает сразу
  // для однодневных — сработает когда tourMeta придёт

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

  // --- Формирование секций ---
  let finalSections = [];

  if (isMultiDay) {
    // ids берём из локального JSON
    finalSections = (tourMeta?.itinerary ?? []).flatMap((dayGroup) =>
      dayGroup.ids.map(id => {
        const place = dbPlaces.find(p => p.place_id === id);
        if (!place) return null;
        return {
          day: dayGroup.day,
          header: place.header[lang] || "",
          content: place.content[lang] || "",
          fullContent: place.full_content ? place.full_content[lang] : null,
          image: place.images
        };
      }).filter(Boolean)
    );
  } else if (tourMeta?.itinerary_ids) {
    // ids берём из Supabase
    finalSections = tourMeta.itinerary_ids.map(id => {
      const place = dbPlaces.find(p => p.place_id === id);
      if (!place) return null;
      return {
        day: 1,
        header: place.header[lang] || "",
        content: place.content[lang] || "",
        fullContent: place.full_content ? place.full_content[lang] : null,
        image: place.images
      };
    }).filter(Boolean);
  }

  const relatedToursFormatted = toursData
    .filter(item => item.id !== tourId)
    .slice(0, 4)
    .map(rel => ({
      id: rel.id,
      title: rel.title[lang],
      image: rel.imageUrl,
      price: rel.price
    }));

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
        featuresInclude: tourMeta?.features?.include?.[lang] ?? [],
        featuresNotInclude: tourMeta?.features?.exclude?.[lang] ?? []
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