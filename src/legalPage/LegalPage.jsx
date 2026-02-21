import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import NavbarCustom from "../Components/Navbar";
import Footer from '../Components/Footer';
import "./LegalPage.css"

const LegalPage = ({ type }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Выбираем ключ перевода в зависимости от типа (terms или privacy)
  const title = t(`legal.${type}.title`);
  const sections = t(`legal.${type}.sections`, { returnObjects: true }) || [];

  return (
    <div className="legal-page-wrapper  mt-5">
        <NavbarCustom />
      <Container>
        <div className="legal-header mb-5 text-center">
          <h1 className="fw-bold">{title}</h1>
          <div className="title-underline mx-auto"></div>
        </div>
        
        <div className="legal-content mx-auto bg-white p-4 p-md-5 shadow-sm rounded-4">
        <div className="legal-intro mb-4">
            <p className="text-muted">{t(`legal.${type}.intro`)}</p>
        </div>

        {Array.isArray(sections) && sections.map((section, index) => (
            <div key={index} className="legal-section mb-5">
            <h3 className="legal-section-title">{section.header}</h3>
            <p className="legal-section-text">
                {section.content}
            </p>
            </div>
        ))}

        <div className="legal-footer mt-5 pt-4 border-top">
            <p className="small text-secondary mb-1">
            {t('legal.last_updated')}: {new Date().toLocaleDateString()}
            </p>
            <p className="small text-secondary">
            {t('legal.contact_notice')}
            </p>
        </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default LegalPage;