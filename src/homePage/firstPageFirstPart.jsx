import React, { useEffect, useState, useRef } from "react";
import videoSrc from './first page images/xustup.mp4';
import posterSrc from './homePage_poster.webp'; 
import NavbarCustom from "../Components/Navbar";
import "./firstPage.css";
import { useTranslation } from 'react-i18next';

function FirstPageFirstPart() {
  const { t } = useTranslation();
  const videoRef = useRef(null); // 1. Создаем реф для видео

  const [showButtons, setShowButtons] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 867);

  useEffect(() => {
    window.scrollTo(0, 0);

    // 2. ПРИНУДИТЕЛЬНЫЙ ЗАПУСК ВИДЕО
    if (videoRef.current) {
      // Пытаемся запустить видео программно
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Если автозапуск заблокирован (например, режим энергосбережения)
          console.log("Autoplay was prevented, showing poster/play button:", error);
        });
      }
    }
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    const handleScroll = () => setShowButtons(window.scrollY >= window.innerHeight);

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <div className="first-container">
        <div className={`top-buttons ${showButtons ? 'buttons-fixed show' : 'hide'}`}>
          <div className={`flex-container ${showButtons ? 'buttons-fixed-flex-container' : 'hide'}`}>
            <div className="buttonGroupContainer">
              <NavbarCustom isHomePage={true || isMobile} /> 
            </div>
          </div>
        </div>
        
        <div className="center-text">
          <h1 className="animated-text">
            {t('your_journey')}<br />
            <span style={{ fontSize: '2.5rem' }}>
              {t('in_armenia')}
            </span>
          </h1>
        </div>

        <div className="video-container">
          <video 
            ref={videoRef} // 3. Привязываем реф
            id="myVideo" 
            muted 
            autoPlay 
            loop 
            playsInline 
            poster={posterSrc}
            preload="auto" // Добавили для ускорения
          >
            <source src={videoSrc} type="video/mp4" />
            {t('video_not_supported')}
          </video>
        </div>
      </div>
    </div>
  );
}

export default FirstPageFirstPart;