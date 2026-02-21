import React, { useEffect } from "react";
import ToursPageFirstPart from "./toursPageFirstPart";
import Footer from "../Components/Footer";
import NavbarCustom from "../Components/Navbar";
import { Container, Row, Col, Accordion, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Send } from "lucide-react"; 
import "./toursPage.css";

function ToursPage() {
    const { t } = useTranslation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Данные для FAQ (можно потом вынести в отдельный JSON)
    const tourFaqs = [
        {
            q: t('toursPage.faq.q1', 'How do I book a tour?'),
            a: t('toursPage.faq.a1', 'You can book directly on our website by clicking the "Explore Details" button on any tour and then filling out the reservation form. No prepayment is required.')
        },
        {
            q: t('toursPage.faq.q2', 'What is the cancellation policy?'),
            a: t('toursPage.faq.a2', 'You can cancel your tour free of charge up to 24 hours before the start. Please notify us via email or WhatsApp.')
        },
        {
            q: t('toursPage.faq.q3', 'Are the tours private or group?'),
            a: t('toursPage.faq.a3', 'We offer both! Most of the prices listed are for private tours, but we can also organize group trips for larger teams upon request.')
        }
    ];
    
    return (
        <div id="toursPage" className="tour-page-container">
            <NavbarCustom />
            
            <ToursPageFirstPart />

            {/* СЕКЦИЯ 1: Конструктор тура (CTA) */}
            <section className="custom-tour-cta">
                <Container>
                    <div className="cta-glass-card">
                        <Row className="align-items-center">
                            <Col lg={8}>
                                <h2 className="cta-title">{t('toursPage.custom.title', "Didn't find the perfect route?")}</h2>
                                <p className="cta-text">
                                    {t('toursPage.custom.text', "Tell us your preferences, and we will create a personalized itinerary just for you, including hidden gems and local favorites.")}
                                </p>
                            </Col>
                            <Col lg={4} className="text-lg-end">
                                <Link to="/special">
                                    <Button variant="light" className="cta-btn-modern">
                                        {t('toursPage.custom.button', 'Request Custom Tour')} <Send size={18} className="ms-2" />
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
                        <h2 className="section-main-title">{t('toursPage.faq.title', 'Common Questions')}</h2>
                        <p className="text-muted">{t('toursPage.faq.subtitle', 'Everything you need to know before your trip')}</p>
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