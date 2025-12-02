import { useTranslation } from "react-i18next";

const languages = [
  { code: "kz", label: "KZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-1 py-1 text-xs font-medium">
      {languages.map((lang) => {
        const active = i18n.resolvedLanguage === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`rounded px-2 py-1 transition ${
              active ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
