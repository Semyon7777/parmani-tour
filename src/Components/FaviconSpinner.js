import { useEffect } from 'react';

const FaviconSpinner = ({ loading }) => {
  useEffect(() => {
    // Сохраняем путь к твоей обычной иконке (логотипу)
    const favicon = document.getElementById('favicon');
    const originalHref = '/favicon.ico'; // Убедись, что путь совпадает с твоим в public/index.html
    
    // Путь к анимированному gif-спиннеру (его нужно будет добавить в public)
    const spinnerHref = '/spinner-icon.gif'; 

    if (loading) {
      if (favicon) favicon.href = spinnerHref;
    } else {
      // Возвращаем логотип через 0.5 сек для плавности, как ты и хотел
      const timer = setTimeout(() => {
        if (favicon) favicon.href = originalHref;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return null; // Компонент ничего не рендерит на страницу
};

export default FaviconSpinner;