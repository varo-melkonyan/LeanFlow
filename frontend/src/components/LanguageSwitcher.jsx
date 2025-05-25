import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      user.language = lang;
      localStorage.setItem('user', JSON.stringify(user));
    }
  };

  return (
    <select
      onChange={changeLanguage}
      value={i18n.language}
      className="p-1 text-sm border rounded dark:bg-gray-800 dark:text-white"
    >
      <option value="en">EN</option>
      <option value="fr">FR</option>
      <option value="de">DE</option>
    </select>
  );
};

export default LanguageSwitcher;
