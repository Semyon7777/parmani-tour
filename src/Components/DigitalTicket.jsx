import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Calendar, User } from 'lucide-react';

const DigitalTicket = ({ booking }) => {
  const canvasRef = useRef(null);
  const qrValue = `https://parmanitour.com/verify/${booking.id}`;

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, qrValue, {
        width: 170,
        margin: 2,
        color: {
          dark: '#0a260a',
          light: '#f5f5f5',
        },
      });
    }
  }, [qrValue]);

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

const styles = {
  card: {
    maxWidth: '340px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
    overflow: 'hidden',
    color: '#333',
    fontFamily: 'sans-serif',
  },
  header: {
    backgroundColor: '#0a260a',
    padding: '20px 24px',
    textAlign: 'center',
    color: '#fff',
  },
  logo: {
    fontWeight: '800',
    fontSize: '1.2rem',
    letterSpacing: '2px',
  },
  headerSub: {
    fontSize: '0.65rem',
    letterSpacing: '3px',
    color: '#aaa',
    marginTop: '4px',
  },
  body: {
    padding: '20px 24px 16px',
  },
  tourName: {
    fontWeight: '700',
    fontSize: '1rem',
    marginBottom: '10px',
    color: '#0a260a',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.83rem',
    color: '#555',
    marginBottom: '6px',
  },
  // Разделитель
  dividerWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    margin: '0',
  },
  cutoutLeft: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    backgroundColor: '#1a1a2e', // цвет фона модалки
    flexShrink: 0,
    marginLeft: '-11px',
  },
  cutoutRight: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    backgroundColor: '#1a1a2e', // цвет фона модалки
    flexShrink: 0,
    marginRight: '-11px',
  },
  dashed: {
    flex: 1,
    borderTop: '2px dashed #ddd',
    margin: '0 6px',
  },
  // QR блок
  qrSection: {
    padding: '20px 24px 24px',
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

export default DigitalTicket;