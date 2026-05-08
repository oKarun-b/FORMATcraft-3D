import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          nav: {
            studio: 'Studio',
            features: 'Features',
            pricing: 'Pricing',
            login: 'Login',
            getStarted: 'Join the Atelier',
          },
          hero: {
            title: 'Mastering the Art of Digital Creation',
            subtitle: 'FormaCraft 3D is the bridge between traditional craftsmanship and digital precision. A CAD-powered studio for couturiers and carpenters.',
            cta: 'Start Designing',
            explore: 'Explore Atelier',
          },
          modes: {
            fashion: 'Couturier',
            carpentry: 'Charpentier',
          }
        },
      },
      fr: {
        translation: {
          nav: {
            studio: 'Studio',
            features: 'Fonctionnalités',
            pricing: 'Tarifs',
            login: 'Connexion',
            getStarted: 'Rejoindre l\'Atelier',
          },
          hero: {
            title: 'Maîtrisez l\'Art de la Création Digitale',
            subtitle: 'FormaCraft 3D fait le pont entre l\'artisanat traditionnel et la précision numérique. Un studio CAO pour couturiers et charpentiers.',
            cta: 'Commencer',
            explore: 'Explorer l\'Atelier',
          },
          modes: {
            fashion: 'Couturier',
            carpentry: 'Charpentier',
          }
        },
      },
    },
  });

export default i18n;
