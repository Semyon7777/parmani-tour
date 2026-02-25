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
import GroupEcoTours from "./groupEcoTours/GroupEcoTours";
import EcoTourDetails from "./groupEcoTours/EcoTourDetails";
import GroupTourDetails from "./groupEcoTours/GroupTourDetails";
import AboutUsPage from "./aboutUs/AboutUs";
import HistoryPage from "./historyPage/HistoryPage";
import CuisinePage from "./cuisinePage/CuisinePage";
import CulturePage from "./culturePage/CulturePage";
import NaturePage from "./naturePage/NaturePage";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import BookForm from "./Components/bookForm";
import Registration from "./Components/Registration";
import LegalPage from "./legalPage/LegalPage";
import './i18n';


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
      <div className="allPages">
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tours" element={<ToursPage />} />
            <Route path="/hotels" element={<HotelsPage />}/>
            <Route path="/transport" element={<TransportPage />} />
            <Route path="/all-in-one" element={<AllInOne />}/>
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/special" element={<SpecialPage />} />
            <Route path="/group-eco-tours" element={<GroupEcoTours />}/>
            <Route path="/eco-tour/:id" element={<EcoTourDetails />} />
            <Route path="/group-tour/:id" element={<GroupTourDetails />} />
            <Route path="/history" element={<HistoryPage />}/>
            <Route path="/cuisine" element={<CuisinePage />}/>
            <Route path="/culture" element={<CulturePage />}/>
            <Route path="/nature" element={<NaturePage />}/>
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/tours/:tourId" element={<TourPageDynamic />} />
            <Route path="/tours/booking/:tourName" element={<BookForm />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/terms" element={<LegalPage type="terms" />} />
            <Route path="/privacy" element={<LegalPage type="privacy" />} />
          </Routes>
        </Router>
      </div>
  );
}

export default App;
