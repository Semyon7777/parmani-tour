import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import "./Footer.css"
import '@fortawesome/fontawesome-free/css/all.min.css';
import MyIcon from './apple-touch-icon.png';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

export default function Footer() {
  const { t } = useTranslation();
  const location = useLocation();
  const lang = location.pathname.split('/')[1] || 'en';

  return (
    <MDBFooter bgColor='light' className='text-center text-lg-start text-muted'>

      <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
        <div className='me-5 footer-get-connected-container'>
          <span className='footer-get-connected'>{t('footer.getConnected')}</span>
        </div>

        <div>
          <a href='https://www.instagram.com/parmanitour' className='m-1 text-reset social-icon' aria-label="Instagram">
            <MDBIcon fab icon="instagram" />
          </a>
          <a href='https://www.facebook.com/profile.php?id=61565286992607' className='m-1 text-reset social-icon' aria-label="Facebook">
            <MDBIcon fab icon="facebook-f" />
          </a>
          <a href='https://www.tiktok.com/@parmanitour' className='m-1 text-reset social-icon' aria-label="TikTok">
            <MDBIcon fab icon="tiktok" />
          </a>
          <a href='https://www.youtube.com/channel/UCOI_Dsynx11USy4tzBAj5eg' className='m-1 text-reset social-icon' aria-label="YouTube">
            <MDBIcon fab icon="youtube" />
          </a>
        </div>
      </section>

      <section className='footer-box'>
        <MDBContainer fluid className='mt-5 px-4 footer-box-container'>
          <MDBRow className='mt-3 d-flex justify-content-between align-items-start footer-box-items'>

            <MDBCol lg="3" className='mb-4'>
              <h6 className='text-uppercase fw-bold mb-2 d-flex align-items-center footer-parmani-tour-container'>
                <img src={MyIcon} alt="Logo" className="me-2" style={{ width: "45px" }} />
                Parmani Tour
              </h6>
              <p style={{ fontSize: '1rem' }}>{t('footer.description')}</p>
              <div className='footer-messenger-row'>
                <a href='https://wa.me/37495283022' className='text-reset social-icon d-flex justify-content-center' aria-label="WhatsApp">
                  <MDBIcon fab icon="whatsapp" />
                </a>
                <a href='https://t.me/parmanitour' className='text-reset social-icon d-flex justify-content-center' aria-label="Telegram">
                  <MDBIcon fab icon="telegram" />
                </a>
                <a href='viber://chat?number=%2B37495283022' className='text-reset social-icon d-flex justify-content-center' aria-label="Viber">
                  <MDBIcon fab icon="viber" />
                </a>
                <a href='mailto:parmanitour@gmail.com' className='text-reset social-icon d-flex justify-content-center' aria-label="envelope">
                  <MDBIcon fas icon="envelope" />
                </a>
              </div>
            </MDBCol>

            <MDBCol lg="2" className='mb-1'>
              <h6 className='text-uppercase fw-bold mb-2'>{t('footer.toursTitle')}</h6>
              <p><a href={`/${lang}/private-tours`} className='text-reset'>{t('footer.privateTours')}</a></p>
              <p><a href={`/${lang}/group-eco-tours`} className='text-reset'>{t('footer.groupEcoTours')}</a></p>
              <p><a href={`/${lang}/special?tab=school`} className='text-reset'>{t('footer.schoolTours')}</a></p>
            </MDBCol>

            <MDBCol lg="2" className='mb-4'>
              <h6 className='text-uppercase fw-bold mb-2'>{t('footer.servicesTitle')}</h6>
              <p><a href={`/${lang}/hotels`} className='text-reset'>{t('footer.hotels')}</a></p>
              <p><a href={`/${lang}/transport`} className='text-reset'>{t('footer.transport')}</a></p>
              <p><a href={`/${lang}/all-in-one`} className='text-reset'>{t('footer.allInOne')}</a></p>
              <p><a href={`/${lang}/special?tab=custom`} className='text-reset fw-bold'>{t('footer.specialOffers')}</a></p>
            </MDBCol>

            <MDBCol lg="2" className='mb-4'>
              <h6 className='text-uppercase fw-bold mb-2'>{t('footer.armeniaTitle')}</h6>
              <p><a href={`/${lang}/history`} className='text-reset'>{t('footer.history')}</a></p>
              <p><a href={`/${lang}/cuisine`} className='text-reset'>{t('footer.cuisine')}</a></p>
              <p><a href={`/${lang}/nature`} className='text-reset'>{t('footer.nature')}</a></p>
              <p><a href={`/${lang}/culture`} className='text-reset'>{t('footer.culture')}</a></p>
            </MDBCol>

            <MDBCol lg="2" className='mb-4'>
              <h6 className='text-uppercase fw-bold mb-2'>{t('footer.company')}</h6>
              <p><a href={`/${lang}/about-us`} className='text-reset'>{t('footer.aboutUs')}</a></p>
              <p><a href={`/${lang}/terms`} className='text-reset'>{t('footer.terms')}</a></p>
              <p><a href={`/${lang}/privacy`} className='text-reset'>{t('footer.privacy')}</a></p>
            </MDBCol>

          </MDBRow>
        </MDBContainer>
      </section>

      <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © 2026 Copyright: <strong>Parmani Tour</strong>
      </div>

    </MDBFooter>
  );
}