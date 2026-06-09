import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import HomePage from "./homePage/HomePage";
import ToursPage from "./toursPage/ToursPage";
import TourPageDynamic from "./toursPage/TourPageDynamic";
import HotelsPage from "./hotelsPage/hotelsPage";
import TransportPage from "./transportPage/transportPage";
import AllInOne from "./allInOne/AllInOne";
import ContactPage from "./contactPage/ContactPage";
import SpecialPage from "./specialPage/SpecialPage";
import ProfilePage from "./profilePage/ProfilePage";
import GroupEcoTours from "./groupEcoTours/GroupEcoTours";
import ExtremePage from "./extremePage/ExtremePage";
import EcoTourDetails from "./groupEcoTours/EcoTourDetails";
import GroupTourDetails from "./groupEcoTours/GroupTourDetails";
import AboutUsPage from "./aboutUs/AboutUs";
import HistoryPage from "./historyPage/HistoryPage";
import CuisinePage from "./cuisinePage/CuisinePage";
import CulturePage from "./culturePage/CulturePage";
import NaturePage from "./naturePage/NaturePage";
import AuthPage from "./AuthPage/AuthPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import BookForm from "./Components/bookForm";
import LegalPage from "./legalPage/LegalPage";
import RouteTracker from "./Components/RouteTracker";
import SecretScannerPage from "./Components/qrScanner/ScannerPage";
import './i18n';
import { HelmetProvider } from 'react-helmet-async';
import AdminRoute from "./profilePage/AdminRoute";
import AdminPage from "./profilePage/AdminPage";

const LANGS = ['en', 'ru', 'hy'];

function LanguageWrapper({ children }) {
  const { lang } = useParams();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (lang && LANGS.includes(lang) && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  useEffect(() => {
    const l = (i18n.language || 'en').split('-')[0];
    document.documentElement.lang = l;
    document.body.className = `lang-${l}`;
  }, [i18n.language]);

  if (!LANGS.includes(lang)) {
    return <Navigate to="/en" replace />;
  }

  return children;
}

function App() {
  return (
    <HelmetProvider>
      <div className="allPages">
        <Router>
          <RouteTracker />
          <Routes>
            {/* Редирект с / на /en */}
            <Route path="/" element={<Navigate to="/en" replace />} />

            {/* Все роуты с языком */}
            <Route path="/:lang" element={<LanguageWrapper><HomePage /></LanguageWrapper>} />
            <Route path="/:lang/private-tours" element={<LanguageWrapper><ToursPage /></LanguageWrapper>} />
            <Route path="/:lang/private-tours/:tourId" element={<LanguageWrapper><TourPageDynamic /></LanguageWrapper>} />
            <Route path="/:lang/hotels" element={<LanguageWrapper><HotelsPage /></LanguageWrapper>} />
            <Route path="/:lang/transport" element={<LanguageWrapper><TransportPage /></LanguageWrapper>} />
            <Route path="/:lang/all-in-one" element={<LanguageWrapper><AllInOne /></LanguageWrapper>} />
            <Route path="/:lang/contact" element={<LanguageWrapper><ContactPage /></LanguageWrapper>} />
            <Route path="/:lang/special" element={<LanguageWrapper><SpecialPage /></LanguageWrapper>} />
            <Route path="/:lang/profile" element={<LanguageWrapper><ProfilePage /></LanguageWrapper>} />
            <Route path="/:lang/login" element={<LanguageWrapper><AuthPage /></LanguageWrapper>} />
            <Route path="/:lang/group-eco-tours" element={<LanguageWrapper><GroupEcoTours /></LanguageWrapper>} />
            <Route path="/:lang/extreme-tours" element={<LanguageWrapper><ExtremePage /></LanguageWrapper>} />
            <Route path="/:lang/eco-tour/:id" element={<LanguageWrapper><EcoTourDetails /></LanguageWrapper>} />
            <Route path="/:lang/group-tour/:id" element={<LanguageWrapper><GroupTourDetails /></LanguageWrapper>} />
            <Route path="/:lang/history" element={<LanguageWrapper><HistoryPage /></LanguageWrapper>} />
            <Route path="/:lang/cuisine" element={<LanguageWrapper><CuisinePage /></LanguageWrapper>} />
            <Route path="/:lang/culture" element={<LanguageWrapper><CulturePage /></LanguageWrapper>} />
            <Route path="/:lang/nature" element={<LanguageWrapper><NaturePage /></LanguageWrapper>} />
            <Route path="/:lang/about-us" element={<LanguageWrapper><AboutUsPage /></LanguageWrapper>} />
            <Route path="/:lang/tours/booking/:tourName" element={<LanguageWrapper><BookForm /></LanguageWrapper>} />
            <Route path="/:lang/terms" element={<LanguageWrapper><LegalPage type="terms" /></LanguageWrapper>} />
            <Route path="/:lang/privacy" element={<LanguageWrapper><LegalPage type="privacy" /></LanguageWrapper>} />
            <Route path="/:lang/admin" element={<LanguageWrapper><AdminRoute><AdminPage /></AdminRoute></LanguageWrapper>} />

            {/* Без языка — секретные страницы */}
            <Route path="/check-in-v1-x7z92" element={<SecretScannerPage />} />

            {/* Любой другой URL → показываем HomePage */}
            <Route path="*" element={<Navigate to="/en" replace />} />
          </Routes>
        </Router>
      </div>
    </HelmetProvider>
  );
}

export default App;