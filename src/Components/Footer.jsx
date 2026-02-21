import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
import "./Footer.css"
import '@fortawesome/fontawesome-free/css/all.min.css';
import MyIcon from './apple-touch-icon.png';
import { useTranslation } from 'react-i18next'; // Import useTranslation

export default function Footer() {
  const { t } = useTranslation(); // Initialize useTranslation

  return (
    <div className='footerContainer'>
      <MDBFooter bgColor='light' className='text-center text-lg-start text-muted'>
        <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
          <div className='me-5 d-none d-lg-block'>
            <span>{t('footer.getConnected')}</span> {/* Translated text */}
          </div>

          <div>
            <a href='https://www.instagram.com/parmani_tour?igsh=dzRnenQ0ZGJycTEw&utm_source=qr' className='me-4 text-reset social-icon'>
              <MDBIcon fab icon="instagram" />
            </a>
            <a href='https://wa.me/37493641069' className='me-4 text-reset social-icon'>
              <MDBIcon fab icon="whatsapp" />
            </a>
            <a href='https://t.me/parmani_tour' className='me-4 text-reset social-icon'>
              <MDBIcon fab icon="telegram" />
            </a>
            <a href='https://www.facebook.com/profile.php?id=61565286992607&mibextid=LQQJ4d' className='me-4 text-reset social-icon'>
              <MDBIcon fab icon="facebook-f" />
            </a>
          </div>
        </section>

        <section>
          <MDBContainer className='text-center text-md-start ml-2 mt-5'>
            <MDBRow className='mt-3 d-flex justify-content-center align-items-center'>
              <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>
                <h6 className='text-uppercase fw-bold'>
                  <img src={MyIcon} alt="My Custom Icon" className="me-3" style={{width: "50px"}} />
                  Parmani Tour
                </h6>
                <p>{t('footer.description')}</p>
              </MDBCol>

              <MDBCol md="2" lg="2" xl="2" className='mx-auto mb-4'>
                <h6 className='text-uppercase fw-bold mb-4'>{t('footer.products')}</h6>
                <p>
                  <a href='/about-us' className='text-reset'>
                    {t('footer.aboutUs')}
                  </a>
                </p>
                <p>
                  <a href='/terms' className='text-reset'>
                    {t('footer.terms&Conditions')}
                  </a>
                </p>
                <p>
                  <a href='/privacy' className='text-reset'>
                    {t('footer.privacyPolicy')}
                  </a>
                </p>
              </MDBCol>

              <MDBCol md="2" lg="2" xl="2" className='mx-auto mb-4'>
                <h6 className='text-uppercase fw-bold mb-4'>{t('footer.specialTours')}</h6>
                <p>
                  <a href='/tours' className='text-reset'>
                    {t('footer.bonus')}
                  </a>
                </p>
                <p>
                  <a href='/tours' className='text-reset'>
                    {t('footer.eco')}
                  </a>
                </p>
                <p>
                  <a href='/tours' className='text-reset'>
                    {t('footer.group')}
                  </a>
                </p>
              </MDBCol>

              <MDBCol md="3" lg="2" xl="2" className='mx-auto mb-4'>
                <h6 className='text-uppercase fw-bold mb-4'>{t('footer.armenia')}</h6>
                <p>
                  <a href='/history' className='text-reset'>
                    {t('footer.history')}
                  </a>
                </p>
                <p>
                  <a href='cuisine' className='text-reset'>
                    {t('footer.cuisine')}
                  </a>
                </p>
                <p>
                  <a href='culture' className='text-reset'>
                    {t('footer.culture')}
                  </a>
                </p>
                <p>
                  <a href='nature' className='text-reset'>
                    {t('footer.nature')}
                  </a>
                </p>
              </MDBCol>

            </MDBRow>
          </MDBContainer>
        </section>

        <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
          © 2026 Copyright: Parmani Tour
          {/* <a className='text-reset fw-bold' href='https://mdbootstrap.com/'>
            MDBootstrap.com
          </a> */}
        </div>
      </MDBFooter>
    </div>
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