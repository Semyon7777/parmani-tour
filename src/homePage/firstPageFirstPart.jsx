import React, { useEffect, useState } from "react";
import videoSrc from './first page images/xustup.mp4';
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

    // Initial check
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
            {t('your_journey')}<br /> {/* Заменено на перевод */}
            <span style={{ fontSize: '2.5rem' }}>
              {t('in_armenia')} {/* Заменено на перевод */}
            </span>
          </h1>
        </div>
        <div className="video-container">
          <video id="myVideo" muted autoPlay loop playsInline>
            <source src={videoSrc} type="video/mp4" />
            {t('video_not_supported')} {/* Заменено на перевод */}
          </video>
        </div>
      </div>
    </div>
  );
  
}

export default FirstPageFirstPart;
