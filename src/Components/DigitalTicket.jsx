import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Calendar, User, Download, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import html2canvas from 'html2canvas'

const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 480);
  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 480);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
};

const DigitalTicket = ({ booking }) => {

  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const canvasRef = useRef(null);
  const cardRef = useRef(null);
  const qrValue = `https://parmanitour.com/verify/${booking.id}`;
  

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, qrValue, {
        width: isMobile ? 140 : 170,  // QR меньше на мобиле
        margin: 2,
        color: {
          dark: '#0a260a',
          light: '#f5f5f5',
        },
      });
    }
  }, [qrValue, isMobile]);

  // ✅ Скачать тикет как PNG
  const handleDownload = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { scale: 2 });
    const link = document.createElement('a');
    link.download = `parmani-ticket-${booking.id.slice(0, 8)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // ✅ Поделиться (мобильный Web Share API или копирование ссылки)
  const handleShare = async () => {
    if (!cardRef.current) return;

    const canvas = await html2canvas(cardRef.current, { scale: 2 });

    canvas.toBlob(async (blob) => {
      const file = new File([blob], `parmani-ticket-${booking.id.slice(0, 8)}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        // ✅ Мобильный — нативный шеринг
        await navigator.share({
          title: 'Parmani Tour Ticket',
          text: `${booking.tour_name} — ${booking.travel_date}`,
          files: [file],
        });
      } else {
        // ✅ Десктоп — скачиваем картинку
        const link = document.createElement('a');
        link.download = `parmani-ticket-${booking.id.slice(0, 8)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    });
  };

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
      padding: isMobile ? '16px 20px 2px' : '20px 24px 6px',
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
      padding: isMobile ? '16px 20px 0px' : '20px 24px 10px',
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

  const btnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '7px 14px',
    backgroundColor: '#0a260a',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.logo}>
          PARMANI <span style={{ color: '#4caf50' }}>TOUR</span>
        </div>
        <div style={styles.headerSub}>{t('ticket.title')}</div>
      </div>

      <div style={styles.body}>
        <h5 style={styles.tourName}>{booking.tour_name}</h5>
        
        <div style={styles.metaRow}>
          <Calendar size={14} style={{ marginRight: 6 }} />
          {booking.travel_date || t('ticket.date_pending')}
        </div>
        
        <div style={styles.metaRow}>
          <User size={14} style={{ marginRight: 6 }} />
          {booking.full_name}
        </div>

        <div style={styles.metaRow}>
          {t('ticket.guests', { count: booking.guests_count })}
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
        <div style={styles.hint}>{t('ticket.show_code')}</div>
      </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '5px', justifyContent: 'center', marginBottom: "10px" }}>
          <button onClick={handleDownload} style={btnStyle}>
            <Download size={16} /> {t('ticket.download')}
          </button>
          <button onClick={handleShare} style={btnStyle}>
            <Share2 size={16} /> {t('ticket.share')}
          </button>
        </div>
    </div>
  );
};

export default DigitalTicket;