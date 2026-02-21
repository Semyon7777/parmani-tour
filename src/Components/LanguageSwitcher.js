import React from 'react';
import { useTranslation } from 'react-i18next';
import "./LanguageSwitcher.css"

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    .catch(err => console.error('Failed to change language', err));
  };

  return (
    <div className='LanguageSwitcherContainer'>
      <button onClick={() => changeLanguage('en')} className='LanguageSwitcherButton'>
        <img alt='usa' src='https://vectorflags.s3.amazonaws.com/flags/us-circle-01.png'/>
      </button>
      <button onClick={() => changeLanguage('ru')} className='LanguageSwitcherButton'>
        <img alt='ru' src='https://vectorflags.s3.amazonaws.com/flags/ru-sphere-01.png'/>
      </button>
      <button onClick={() => changeLanguage('hy')} className='LanguageSwitcherButton'>
        <img alt='arm' src='https://vectorflags.s3.amazonaws.com/flags/am-circle-01.png'/>
      </button>
    </div>
  );
}

export default LanguageSwitcher;
