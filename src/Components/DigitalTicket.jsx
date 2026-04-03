import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Calendar, User } from 'lucide-react';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    setIsMobile(window.innerWidth < 480);
    const handler = () => setIsMobile(window.innerWidth < 480);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
};

const DigitalTicket = ({ booking }) => {
  
  const isMobile = useIsMobile();
  const canvasRef = useRef(null);
  const qrValue = `https://parmanitour.com/verify/${booking.id}`;

  useEffect(() => {
    if (!canvasRef.current) return; // уже есть
    
    // Небольшая задержка на случай если модалка ещё анимируется
    const timer = setTimeout(() => {
      QRCode.toCanvas(canvasRef.current, qrValue, {
        width: isMobile ? 140 : 170,
        margin: 2,
        color: {
          dark: '#0a260a',
          light: '#f5f5f5',
        },
      }).catch(err => console.error('QR error:', err));
    }, 100);

    return () => clearTimeout(timer);
  }, [qrValue, isMobile]);

    const styles = {
    card: {
      maxWidth: isMobile ? '100%' : '340px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      borderRadius: isMobile ? '20px' : '24px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
      overflow: 'hidden',
      color: '#333',
      fontFamily: 'sans-serif',
    },
    header: {
      backgroundColor: '#0a260a',
      padding: isMobile ? '16px 20px' : '20px 24px',
      textAlign: 'center',
      color: '#fff',
    },
    logo: {
      fontWeight: '800',
      fontSize: isMobile ? '1rem' : '1.2rem',
      letterSpacing: '2px',
    },
    headerSub: {
      fontSize: '0.65rem',
      letterSpacing: '3px',
      color: '#aaa',
      marginTop: '4px',
    },
    body: {
      padding: isMobile ? '16px 20px 12px' : '20px 24px 16px',
    },
    tourName: {
      fontWeight: '700',
      fontSize: isMobile ? '0.95rem' : '1rem',
      marginBottom: '10px',
      color: '#0a260a',
    },
    metaRow: {
      display: 'flex',
      alignItems: 'center',
      fontSize: isMobile ? '0.78rem' : '0.83rem',
      color: '#555',
      marginBottom: '6px',
    },
    dividerWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    cutoutLeft: {
      width: '22px',
      height: '22px',
      borderRadius: '50%',
      backgroundColor: '#1a1a2e',
      flexShrink: 0,
      marginLeft: '-11px',
    },
    cutoutRight: {
      width: '22px',
      height: '22px',
      borderRadius: '50%',
      backgroundColor: '#1a1a2e',
      flexShrink: 0,
      marginRight: '-11px',
    },
    dashed: {
      flex: 1,
      borderTop: '2px dashed #ddd',
      margin: '0 6px',
    },
    qrSection: {
      padding: isMobile ? '16px 20px 20px' : '20px 24px 24px',
      textAlign: 'center',
    },
    qrWrapper: {
      display: 'inline-block',
      padding: '10px',
      backgroundColor: '#f5f5f5',
      borderRadius: '16px',
    },
    bookingId: {
      marginTop: '12px',
      fontSize: '0.75rem',
      fontWeight: '700',
      letterSpacing: '2px',
      color: '#0a260a',
    },
    hint: {
      fontSize: '0.7rem',
      color: '#aaa',
      marginTop: '4px',
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.logo}>
          PARMANI <span style={{ color: '#4caf50' }}>TOUR</span>
        </div>
        <div style={styles.headerSub}>ЭЛЕКТРОННЫЙ БИЛЕТ</div>
      </div>

      <div style={styles.body}>
        <h5 style={styles.tourName}>{booking.tour_name}</h5>
        <div style={styles.metaRow}>
          <Calendar size={14} style={{ marginRight: 6 }} />
          {booking.travel_date || 'Дата уточняется'}
        </div>
        <div style={styles.metaRow}>
          <User size={14} style={{ marginRight: 6 }} />
          {booking.full_name || booking.guests_count + ' чел.'}
        </div>
      </div>

      <div style={styles.dividerWrapper}>
        <div style={styles.cutoutLeft} />
        <div style={styles.dashed} />
        <div style={styles.cutoutRight} />
      </div>

      <div style={styles.qrSection}>
        <div style={styles.qrWrapper}>
          <canvas ref={canvasRef} />
        </div>
        <div style={styles.bookingId}>ID: {booking.id.slice(0, 8).toUpperCase()}</div>
        <div style={styles.hint}>Покажите этот код на входе</div>
      </div>
    </div>
  );
};

export default DigitalTicket;