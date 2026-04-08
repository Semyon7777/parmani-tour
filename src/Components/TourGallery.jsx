import React, { useState } from "react";
import "./TourGallery.css";

/**
 * TourGallery
 * Props:
 *   images — массив URL строк из Supabase (колонка gallery)
 *   alt    — строка для alt текста
 */
function TourGallery({ images = [], alt = "Tour image" }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Если нет картинок — не рендерим вообще
  if (!images || images.length === 0) return null;

  // Cloudinary оптимизация — вставляем параметры если ссылка с cloudinary
  const optimize = (url, width = 1200) => {
    if (!url) return url;
    if (url.includes("cloudinary.com") && url.includes("/upload/")) {
      return url.replace("/upload/", `/upload/w_${width},c_fill,f_auto,q_auto/`);
    }
    return url;
  };

  const activeImage = images[activeIndex];

  return (
    <div className="tour-gallery">
      {/* Большое главное фото */}
      <div className="tour-gallery-main">
        <img
          src={optimize(activeImage, 1200)}
          alt={alt}
          className="tour-gallery-main-img"
          loading="lazy"
        />
        {/* Счётчик */}
        {images.length > 1 && (
          <div className="tour-gallery-counter">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Миниатюры справа — показываем только если больше 1 фото */}
      {images.length > 1 && (
        <div className="tour-gallery-thumbs">
          {images.map((img, i) => (
            <button
              key={i}
              className={`tour-gallery-thumb ${i === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Photo ${i + 1}`}
            >
              <img
                src={optimize(img, 300)}
                alt={`${alt} ${i + 1}`}
                loading="lazy"
              />
              {/* Затемнение неактивных */}
              {i !== activeIndex && <div className="thumb-overlay" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


export default TourGallery;