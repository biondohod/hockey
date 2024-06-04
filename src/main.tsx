import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { QueryProvider } from "./lib/react-query/queryProvider";
import "./styles/styles.scss";
import AuthProvider from "./context/AuthContext";
import translation_ru from "./translation/ru/global";
import translation_en from "./translation/en/global";
import i18next from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

i18next.use(LanguageDetector).use(initReactI18next).init({
  resources: {
    en: {
      translation: translation_en,
    },
    ru: {
      translation: translation_ru,
    },
  },
  detection: {
    order: ['localStorage', 'navigator'],
    lookupLocalStorage: 'i18nextLng',
    caches: ['localStorage'],
  },
  load: 'languageOnly',
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <I18nextProvider i18n={i18next}>
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  </I18nextProvider>
);
