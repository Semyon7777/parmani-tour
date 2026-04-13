import React, { useEffect, useState, useRef } from "react";
import videoSrc from './first page images/xustup.mp4';
import videoMobileSrc from './first page images/xustup_mobile.mp4';
import posterSrc from './homePage_poster.webp'; 
import NavbarCustom from "../Components/Navbar";
import "./firstPage.css";
import { useTranslation } from 'react-i18next';

const CLOUDINARY_BASE = "https://res.cloudinary.com/dwqsqiezw/video/upload";
const VIDEO_ID = "v1776034105/xustup_original_tm2xaf.mp4";

const CLOUDINARY_URL_720 = `${CLOUDINARY_BASE}/q_auto,f_auto,w_1280,h_720/${VIDEO_ID}`;
const CLOUDINARY_URL_1080 = `${CLOUDINARY_BASE}/q_auto,f_auto,w_1920,h_1080/${VIDEO_ID}`;

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const getCloudinaryUrl = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!connection) return CLOUDINARY_URL_1080;
  const isSlow = connection.saveData || ["slow-2g", "2g", "3g"].includes(connection.effectiveType);
  return isSlow ? CLOUDINARY_URL_720 : CLOUDINARY_URL_1080;
};

let hqLoaded = false;
let hqLoadedUrl = "";

function FirstPageFirstPart() {
  const { t } = useTranslation();
  const videoRef = useRef(null); 
  const hqVideoRef = useRef(null);
  const [showButtons, setShowButtons] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false); 

  useEffect(() => {
    window.scrollTo(0, 0);

    const video = videoRef.current;
    if (!video) return;

    alert(`isMobile: ${isMobile}\nVideo: ${isMobile ? "MOBILE" : "DESKTOP"}`);

    // Мобильный — просто запускаем мобильное видео, никакой логики LQ→HQ
    if (isMobile) {
      video.play().catch(() => setVideoFailed(true));
      return;
    }

    // Десктоп — вся логика LQ→HQ как раньше
    if (hqLoaded) {
      video.src = hqLoadedUrl;
      video.loop = true;
      video.play().catch(() => setVideoFailed(true));
      return;
    }

    if (!hqVideoRef.current) {
      const hqVideo = document.createElement("video");
      hqVideo.preload = "auto";
      hqVideoRef.current = hqVideo;
    }

    const hqVideo = hqVideoRef.current;

    video.play().catch(() => setVideoFailed(true));

    const startHqLoad = () => {
      if (!hqVideoRef.current) return;
      const url = getCloudinaryUrl();
      hqVideo.src = url;
      hqVideo.load();

      hqVideo.addEventListener("canplaythrough", () => {
        hqLoaded = true;
        hqLoadedUrl = url;
      }, { once: true });
    };

    if (document.readyState === "complete") {
      startHqLoad();
    } else {
      window.addEventListener("load", startHqLoad, { once: true });
    }

    const handleEnded = () => {
      if (hqLoaded) {
        video.src = hqLoadedUrl;
        video.loop = true;
        video.play().catch(console.warn);
        video.removeEventListener("ended", handleEnded);
      } else {
        video.currentTime = 0;
        video.play().catch(console.warn);
      }
    };

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
      window.removeEventListener("load", startHqLoad);

      if (!hqLoaded) {
        hqVideo.pause();
        hqVideo.src = "";
        hqVideo.load();
        hqVideoRef.current = null;
      }
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
              {/* Мобильный получает своё видео, десктоп — LQ */}
              <source src={isMobile ? videoMobileSrc : videoSrc} type="video/mp4" />
              {t('video_not_supported')}
            </video>
          )}
        </div>
      </div>
    </div>
  );
}

export default FirstPageFirstPart;