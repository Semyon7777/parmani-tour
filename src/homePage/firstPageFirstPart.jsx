import React, { useEffect, useState } from "react";
import videoSrc from './first page images/xustup.mp4';
import posterSrc from './homePage_poster.webp'; 
import NavbarCustom from "../Components/Navbar";
import "./firstPage.css";
import { useTranslation } from 'react-i18next';

function FirstPageFirstPart() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [showButtons, setShowButtons] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 867);
  const { t } = useTranslation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const handleScroll = () => {
      setShowButtons(window.scrollY >= window.innerHeight);
    };

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
          {/* 2. Добавлен атрибут poster */}
          <video 
            id="myVideo" 
            muted 
            autoPlay 
            loop 
            playsInline 
            poster={posterSrc} 
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