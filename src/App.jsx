import React, {useEffect} from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useTranslation } from "react-i18next"; // Добавили хук перевода
import HomePage from "./homePage/HomePage";
import ToursPage from "./toursPage/ToursPage"; 
import TourPageDynamic from "./toursPage/TourPageDynamic"; // Укажи свой путь
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


function App() {

  const { i18n } = useTranslation(); // Инициализируем i18n внутри компонента

  useEffect(() => {
    // Этот код срабатывает каждый раз, когда меняется язык
    // Он берет текущий язык (en, ru или hy) и записывает его в <html lang="...">
    document.documentElement.lang = i18n.language;
    
    // Дополнительный лайфхак: если вы хотите менять шрифты для всего сайта сразу,
    // можно менять и класс у body
    document.body.className = `lang-${i18n.language}`;
  }, [i18n.language]);

  return (
    <HelmetProvider>
      <div className="allPages">
        <Router>
          <RouteTracker /> {/* Вот здесь он будет "слушать" переходы */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/private-tours" element={<ToursPage />} />
            <Route path="/hotels" element={<HotelsPage />}/>
            <Route path="/transport" element={<TransportPage />} />
            <Route path="/all-in-one" element={<AllInOne />}/>
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/special" element={<SpecialPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/group-eco-tours" element={<GroupEcoTours />}/>
            <Route path="/extreme-tours" element={<ExtremePage />} />
            <Route path="/eco-tour/:id" element={<EcoTourDetails />} />
            <Route path="/group-tour/:id" element={<GroupTourDetails />} />
            <Route path="/history" element={<HistoryPage />}/>
            <Route path="/cuisine" element={<CuisinePage />}/>
            <Route path="/culture" element={<CulturePage />}/>
            <Route path="/nature" element={<NaturePage />}/>
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/private-tours/:tourId" element={<TourPageDynamic />} />
            <Route path="/tours/booking/:tourName" element={<BookForm />} />
            <Route path="/terms" element={<LegalPage type="terms" />} />
            <Route path="/privacy" element={<LegalPage type="privacy" />} />
            <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
            <Route path="/check-in-v1-x7z92" element={<SecretScannerPage />} />
          </Routes>
        </Router>
      </div>
    </HelmetProvider>
  );
}

export default App;
