import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
import "./Footer.css"
import '@fortawesome/fontawesome-free/css/all.min.css';
import MyIcon from './apple-touch-icon.png';
import { useTranslation } from 'react-i18next'; // Import useTranslation

export default function Footer() {
  const { t } = useTranslation();

  return (
    <MDBFooter bgColor='light' className='text-center text-lg-start text-muted pt-1'>
      {/* Социальные сети */}
      <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
        <div className='me-5 d-none d-lg-block'>
          <span className='footer-get-connected'>{t('footer.getConnected')}</span>
        </div>

        <div>
          <a href='https://www.instagram.com/parmanitour?igsh=dzRnenQ0ZGJycTEw&utm_source=qr' className='m-3 text-reset social-icon'>
            <MDBIcon fab icon="instagram" />
          </a>
          <a href='https://wa.me/37493641069' className='m-3 text-reset social-icon'>
            <MDBIcon fab icon="whatsapp" />
          </a>
          <a href='https://t.me/parmani_tour' className='m-3 text-reset social-icon'>
            <MDBIcon fab icon="telegram" />
          </a>
          <a href='https://www.facebook.com/profile.php?id=61565286992607' className='m-3 text-reset social-icon'>
            <MDBIcon fab icon="facebook-f" />
          </a>
          <a href='https://www.tiktok.com/@parmanitour' className='m-3 text-reset social-icon'>
            <MDBIcon fab icon="tiktok" />
          </a>
          <a href='https://www.youtube.com/channel/UCOI_Dsynx11USy4tzBAj5eg' className='m-3 text-reset social-icon'>
            <MDBIcon fab icon="youtube" />
          </a>
        </div>
      </section>

      {/* Основной контент */}
      <section className='footer-box'>
        <MDBContainer fluid className='mt-5 px-4 footer-box-container'>
          <MDBRow className='mt-3 d-flex justify-content-between align-items-start flex-nowrap-lg footer-box-items'>
            
            {/* 1. BRAND - 25% ширины */}
            <MDBCol lg="3" className='mb-4'>
              <h6 className='text-uppercase fw-bold mb-4 d-flex align-items-center'>
                <img src={MyIcon} alt="Logo" className="me-2" style={{width: "45px"}} />
                Parmani Tour
              </h6>
              <p style={{fontSize: '1rem'}}>{t('footer.description')}</p>
            </MDBCol>

            {/* 2. TOURS - 18% ширины */}
            <MDBCol lg="2" className='mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>{t('footer.toursTitle')}</h6>
              <p><a href='/private-tours' className='text-reset'>{t('footer.privateTours')}</a></p>
              <p><a href='/group-eco-tours' className='text-reset'>{t('footer.groupEcoTours')}</a></p>
              <p><a href='/special?tab=school' className='text-reset'>{t('footer.schoolTours')}</a></p>
            </MDBCol>

            {/* 3. SERVICES - 18% ширины */}
            <MDBCol lg="2" className='mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>{t('footer.servicesTitle')}</h6>
              <p><a href='/hotels' className='text-reset'>{t('footer.hotels')}</a></p>
              <p><a href='/transport' className='text-reset'>{t('footer.transport')}</a></p>
              <p><a href='/all-in-one' className='text-reset'>{t('footer.allInOne')}</a></p>
              <p><a href='/special?tab=custom' className='text-reset fw-bold'>{t('footer.specialOffers')}</a></p>
            </MDBCol>

            {/* 4. ARMENIA - 18% ширины */}
            <MDBCol lg="2" className='mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>{t('footer.armeniaTitle')}</h6>
              <p><a href='/history' className='text-reset'>{t('footer.history')}</a></p>
              <p><a href='/cuisine' className='text-reset'>{t('footer.cuisine')}</a></p>
              <p><a href='/nature' className='text-reset'>{t('footer.nature')}</a></p>
              <p><a href='/culture' className='text-reset'>{t('footer.culture')}</a></p>
            </MDBCol>

            {/* 5. COMPANY - 18% ширины */}
            <MDBCol lg="2" className='mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>{t('footer.company')}</h6>
              <p><a href='/about-us' className='text-reset'>{t('footer.aboutUs')}</a></p>
              <p><a href='/terms' className='text-reset'>{t('footer.terms')}</a></p>
              <p><a href='/privacy' className='text-reset'>{t('footer.privacy')}</a></p>
            </MDBCol>

          </MDBRow>
        </MDBContainer>
      </section>

      {/* Копирайт */}
      <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © 2026 Copyright: <strong>Parmani Tour</strong>
      </div>
    </MDBFooter>
  );
}

// weather api

// const Weather = () => {
//   const { t, i18n } = useTranslation();
//   const [weather, setWeather] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const language = i18n.language
//     const apiKey = '6eaf9f74b316e6a58d02169580fb2006'; 
//     const lat = 40.1776;
//     const lon = 44.5126;
//     const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=${language}`;

//     axios.get(url)
//       .then(response => {
//         setWeather(response.data);
//       })
//       .catch(error => {
//         console.error('Ошибка при запросе:', error);
//         setError('Не удалось получить данные о погоде');
//       });
//   }, [i18n.language]);

//   if (error) {
//     return console.log(t('weather.error'));
//   }

//   if (!weather) {
//     return console.log(t('weather.loading'));
//   }

//   return (
//     <div className="weather-container">
//       <div className="weather-info">
//         <h2 className="weather-city">
//           {t('footer.weather.city', { city: weather.name })}
//         </h2>
//         <p className="weather-temp">
//           <i className="fas fa-thermometer-half"></i> {t('footer.weather.temperature', { temp: weather.main.temp })}
//         </p>
//         {/* <p className="weather-desc">
//           <i className="fas fa-cloud"></i> {t('footer.weather.description', { description: weather.weather[0].description })}
//         </p> */}
//       </div>
//     </div>
//   );
// };