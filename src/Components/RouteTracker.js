import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const RouteTracker = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // При каждой смене маршрута принудительно сбрасываем иконку
    const link = document.getElementById('favicon') || document.querySelector("link[rel*='icon']");
    if (link) {
      link.href = '/images/favicon.ico'; // Путь к твоей основной иконке
    }
  }, [pathname]);

  return null;
};

export default RouteTracker;