import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import "./Footer.css"
import '@fortawesome/fontawesome-free/css/all.min.css';
import MyIcon from './apple-touch-icon.png';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <MDBFooter bgColor='light' className='text-center text-lg-start text-muted'>

      {/* ── СОЦСЕТИ (Instagram, Facebook, TikTok, YouTube) ── */}
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

      {/* ── ОСНОВНОЙ КОНТЕНТ ── */}
      <section className='footer-box'>
        <MDBContainer fluid className='mt-5 px-4 footer-box-container'>
          <MDBRow className='mt-3 d-flex justify-content-between align-items-start footer-box-items'>

            {/* 1. BRAND + МЕССЕНДЖЕРЫ */}
            <MDBCol lg="3" className='mb-4'>
              <h6 className='text-uppercase fw-bold mb-2 d-flex align-items-center footer-parmani-tour-container'>
                <img src={MyIcon} alt="Logo" className="me-2" style={{ width: "45px" }} />
                Parmani Tour
              </h6>
              <p style={{ fontSize: '1rem' }}>{t('footer.description')}</p>

              {/* Мессенджеры под описанием */}
              {/* <span className='footer-messenger-label'>
                {t('footer.contactUs', 'Написать нам')}
              </span> */}
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

            {/* 2. ТУРЫ */}
            <MDBCol lg="2" className='mb-1'>
              <h6 className='text-uppercase fw-bold mb-2'>{t('footer.toursTitle')}</h6>
              <p><a href='/private-tours' className='text-reset'>{t('footer.privateTours')}</a></p>
              <p><a href='/group-eco-tours' className='text-reset'>{t('footer.groupEcoTours')}</a></p>
              <p><a href='/special?tab=school' className='text-reset'>{t('footer.schoolTours')}</a></p>
            </MDBCol>

            {/* 3. УСЛУГИ */}
            <MDBCol lg="2" className='mb-4'>
              <h6 className='text-uppercase fw-bold mb-2'>{t('footer.servicesTitle')}</h6>
              <p><a href='/hotels' className='text-reset'>{t('footer.hotels')}</a></p>
              <p><a href='/transport' className='text-reset'>{t('footer.transport')}</a></p>
              <p><a href='/all-in-one' className='text-reset'>{t('footer.allInOne')}</a></p>
              <p><a href='/special?tab=custom' className='text-reset fw-bold'>{t('footer.specialOffers')}</a></p>
            </MDBCol>

            {/* 4. АРМЕНИЯ */}
            <MDBCol lg="2" className='mb-4'>
              <h6 className='text-uppercase fw-bold mb-2'>{t('footer.armeniaTitle')}</h6>
              <p><a href='/history' className='text-reset'>{t('footer.history')}</a></p>
              <p><a href='/cuisine' className='text-reset'>{t('footer.cuisine')}</a></p>
              <p><a href='/nature' className='text-reset'>{t('footer.nature')}</a></p>
              <p><a href='/culture' className='text-reset'>{t('footer.culture')}</a></p>
            </MDBCol>

            {/* 5. КОМПАНИЯ */}
            <MDBCol lg="2" className='mb-4'>
              <h6 className='text-uppercase fw-bold mb-2'>{t('footer.company')}</h6>
              <p><a href='/about-us' className='text-reset'>{t('footer.aboutUs')}</a></p>
              <p><a href='/terms' className='text-reset'>{t('footer.terms')}</a></p>
              <p><a href='/privacy' className='text-reset'>{t('footer.privacy')}</a></p>
            </MDBCol>

          </MDBRow>
        </MDBContainer>
      </section>

      {/* ── КОПИРАЙТ ── */}
      <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © 2026 Copyright: <strong>Parmani Tour</strong>
      </div>

    </MDBFooter>
  );
}