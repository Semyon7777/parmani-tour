import { useEffect } from 'react';

const FaviconSpinner = ({ loading }) => {
  useEffect(() => {
    const link = document.getElementById('favicon') || document.querySelector("link[rel*='icon']");
    const originalHref = '/images/favicon.ico'; // Убедись, что путь верный

    if (!loading) {
      if (link) link.href = originalHref;
      return;
    }

    let angle = 0;
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    const interval = setInterval(() => {
      ctx.clearRect(0, 0, 32, 32);
      ctx.beginPath();
      ctx.arc(16, 16, 12, angle, angle + Math.PI * 1.5);
      ctx.strokeStyle = '#3a7d44';
      ctx.lineWidth = 6;
      ctx.stroke();
      
      if (link) link.href = canvas.toDataURL('image/png');
      angle += 0.3;
    }, 50);

    return () => {
      clearInterval(interval);
      if (link) link.href = originalHref;
    };
  }, [loading]);

  return null;
};

export default FaviconSpinner;