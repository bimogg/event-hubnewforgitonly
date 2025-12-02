import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import kz from "./locales/kz/common.json";
import ru from "./locales/ru/common.json";
import en from "./locales/en/common.json";

export const resources = {
  kz: { translation: kz },
  ru: { translation: ru },
  en: { translation: en },
} as const;

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "kz",
    supportedLngs: ["kz", "ru", "en"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

export default i18n;
