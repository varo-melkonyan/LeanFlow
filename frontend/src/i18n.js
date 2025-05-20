import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      submit: 'Submit',
      logout: 'Logout',
      dashboard: 'Dashboard',
      tickets: 'Tickets',
      chats: 'Chats',
      teams: 'Support Teams',
    },
  },
  ru: {
    translation: {
      login: 'Вход',
      register: 'Регистрация',
      email: 'Эл. почта',
      password: 'Пароль',
      name: 'Имя',
      submit: 'Отправить',
      logout: 'Выход',
      dashboard: 'Панель',
      tickets: 'Заявки',
      chats: 'Чаты',
      teams: 'Группы поддержки',
    },
  },
  fr: {
    translation: {
      login: 'Connexion',
      register: 'Inscription',
      email: 'Email',
      password: 'Mot de passe',
      name: 'Nom',
      submit: 'Valider',
      logout: 'Déconnexion',
      dashboard: 'Tableau de bord',
      tickets: 'Tickets',
      chats: 'Discussions',
      teams: 'Équipes support',
    },
  },
  de: {
    translation: {
      login: 'Anmelden',
      register: 'Registrieren',
      email: 'E-Mail',
      password: 'Passwort',
      name: 'Name',
      submit: 'Einreichen',
      logout: 'Abmelden',
      dashboard: 'Dashboard',
      tickets: 'Tickets',
      chats: 'Chats',
      teams: 'Support-Teams',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
