import React, { useEffect } from "react";
import ToursPageFirstPart from "./toursPageFirstPart";
import Footer from "../Components/Footer";
import NavbarCustom from "../Components/Navbar";
import { Container, Row, Col, Accordion, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Send } from "lucide-react"; 
import "./toursPage.css";

import SEO from "../Components/SEO";

function ToursPage() {
    const { t, i18n } = useTranslation();
    const lang = (i18n.language || 'en').split('-')[0];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Данные для FAQ (можно потом вынести в отдельный JSON)
    const tourFaqs = [
        { q: t('tour_info_page.faq.q1'), a: t('tour_info_page.faq.a1') },
        { q: t('tour_info_page.faq.q2'), a: t('tour_info_page.faq.a2') },
        { q: t('tour_info_page.faq.q3'), a: t('tour_info_page.faq.a3') },
        { q: t('tour_info_page.faq.q4'), a: t('tour_info_page.faq.a4') },
        { q: t('tour_info_page.faq.q5'), a: t('tour_info_page.faq.a5') },
        { q: t('tour_info_page.faq.q6'), a: t('tour_info_page.faq.a6') },
        { q: t('tour_info_page.faq.q7'), a: t('tour_info_page.faq.a7') },
        { q: t('tour_info_page.faq.q8'), a: t('tour_info_page.faq.a8') },
        { q: t('tour_info_page.faq.q9'), a: t('tour_info_page.faq.a9') },
        { q: t('tour_info_page.faq.q10'), a: t('tour_info_page.faq.a10') },
        { q: t('tour_info_page.faq.q11'), a: t('tour_info_page.faq.a11') }
    ];
    
    return (
        <div id="toursPage" className="tour-page-container">
            <SEO
            title="Private Tours in Armenia"
            description="Browse all private tours in Armenia — cultural, nature, gastronomic and multi-day routes. Professional guides, comfortable transport."
            url="/private-tours"
            lang={lang}
            schema={{
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "Private Tours in Armenia",
                "description": "Browse all private tours in Armenia",
                "url": "https://www.parmanitour.com/private-tours",
                "provider": {
                "@type": "TravelAgency",
                "name": "Parmani Tour",
                "url": "https://www.parmanitour.com"
                }
            }}
            />

            <NavbarCustom />
            
            <ToursPageFirstPart />

            {/* СЕКЦИЯ 1: Конструктор тура (CTA) */}
            <section className="custom-tour-cta">
                <Container>
                    <div className="cta-glass-card">
                        <Row className="align-items-center">
                            <Col lg={8}>
                                <h2 className="cta-title">{t('tour_info_page.custom.title')}</h2>
                                <p className="cta-text">
                                    {t('tour_info_page.custom.text')}
                                </p>
                            </Col>
                            <Col lg={4} className="text-lg-end">
                                <Link to={`/${lang}/special`}>
                                    <Button variant="light" className="cta-btn-modern">
                                        {t('tour_info_page.custom.button')} <Send size={18} className="ms-2" />
                                    </Button>
                                </Link>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </section>

            {/* СЕКЦИЯ 2: FAQ по турам */}
            <section className="tours-faq-section py-5">
                <Container>
                    <div className="text-center mb-5">
                        <h2 className="section-main-title">{t('tour_info_page.faq.title')}</h2>
                        <p className="text-muted">{t('tour_info_page.faq.subtitle')}</p>
                    </div>
                    
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <Accordion className="modern-faq-accordion">
                                {tourFaqs.map((faq, index) => (
                                    <Accordion.Item key={index} eventKey={index.toString()}>
                                        <Accordion.Header>{faq.q}</Accordion.Header>
                                        <Accordion.Body>{faq.a}</Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        </Col>
                    </Row>
                </Container>
            </section>

            <Footer />
        </div>
    );
}

export default ToursPage;