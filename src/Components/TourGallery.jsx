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
  const [displayIndex, setDisplayIndex] = useState(0); // what's actually visible
  const [isLoading, setIsLoading] = useState(false);

  if (!images || images.length === 0) return null;

  const optimize = (url, width = 1200) => {
    if (!url) return url;
    if (url.includes("cloudinary.com") && url.includes("/upload/")) {
      return url.replace("/upload/", `/upload/w_${width},c_fill,f_auto,q_auto/`);
    }
    return url;
  };

  const handleThumbClick = (i) => {
    if (i === activeIndex) return;
    setIsLoading(true);
    setActiveIndex(i); // start loading new image in background
  };

  return (
    <div className="tour-gallery">
      <div className="tour-gallery-main">
        {/* Current visible image — stays until new one is ready */}
        <img
          src={optimize(images[displayIndex], 1200)}
          alt={alt}
          className="tour-gallery-main-img"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* New image loading in background, invisible until ready */}
        {isLoading && (
          <img
            key={activeIndex}
            src={optimize(images[activeIndex], 1200)}
            alt={alt}
            className="tour-gallery-main-img"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0 }}
            onLoad={() => {
              setDisplayIndex(activeIndex);
              setIsLoading(false);
            }}
            onError={() => {
              setDisplayIndex(activeIndex);
              setIsLoading(false);
            }}
          />
        )}

        {images.length > 1 && (
          <div className="tour-gallery-counter">
            {displayIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="tour-gallery-thumbs">
          {images.map((img, i) => (
            <button
              key={i}
              className={`tour-gallery-thumb ${i === activeIndex ? "active" : ""}`}
              onClick={() => handleThumbClick(i)}
              aria-label={`Photo ${i + 1}`}
            >
              <img src={optimize(img, 300)} alt={`${alt} ${i + 1}`} loading="lazy" />
              {i !== activeIndex && <div className="thumb-overlay" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


export default TourGallery;