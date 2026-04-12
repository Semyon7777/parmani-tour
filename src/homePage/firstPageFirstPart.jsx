import React, { useEffect, useState, useRef } from "react";
import videoSrc from './first page images/xustup.mp4';        // 2.8MB LQ
import videoHqSrc from './first page images/xustup_hq.mp4';   // ~5MB HQ
import posterSrc from './homePage_poster.webp'; 
import NavbarCustom from "../Components/Navbar";
import "./firstPage.css";
import { useTranslation } from 'react-i18next';

function FirstPageFirstPart() {
  const { t } = useTranslation();
  const videoRef = useRef(null); 
  const [showButtons, setShowButtons] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false); 

  useEffect(() => {
    window.scrollTo(0, 0);

    const video = videoRef.current;
    if (!video) return;

    // Запускаем LQ видео
    video.play().catch((error) => {
      console.log("Autoplay blocked:", error);
      setVideoFailed(true);
    });

    // Фоном грузим HQ
    const hqVideo = document.createElement("video");
    hqVideo.src = videoHqSrc;
    hqVideo.preload = "auto";

    hqVideo.addEventListener("canplaythrough", () => {
      // Свапаем в момент когда петля начинается заново — пользователь не заметит
      const swapOnLoop = () => {
        video.src = videoHqSrc;
        video.loop = true;
        video.play().catch(console.warn);
        video.removeEventListener("ended", swapOnLoop);
        console.log("✅ Switched to HQ");
      };
      video.addEventListener("ended", swapOnLoop);
    }, { once: true });

    hqVideo.load();

    return () => {
      hqVideo.src = "";
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowButtons(window.scrollY >= window.innerHeight);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <div className="first-container">
        <div className={`top-buttons ${showButtons ? 'buttons-fixed show' : 'hide'}`}>
          <div className={`flex-container ${showButtons ? 'buttons-fixed-flex-container' : 'hide'}`}>
            <div className="buttonGroupContainer">
              <NavbarCustom isHomePage={true} /> 
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
          {videoFailed ? (
            <img 
              src={posterSrc} 
              alt="Background" 
              className="hero-video-fallback"
              style={{ width: '100%', height: '100vh', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <video 
              ref={videoRef} 
              id="myVideo" 
              muted 
              autoPlay 
              loop 
              playsInline 
              poster={posterSrc}
              preload="auto" 
            >
              <source src={videoSrc} type="video/mp4" />
              {t('video_not_supported')}
            </video>
          )}
        </div>
      </div>
    </div>
  );
}

export default FirstPageFirstPart;