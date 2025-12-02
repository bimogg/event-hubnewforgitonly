import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { LanguageSwitcher } from "./components/LanguageSwitcher";

export function AppLayout() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 antialiased">
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            <span className="font-bold text-xl tracking-tight text-white">EventHub</span>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <Link to="/events" className="hover:text-white transition">
              {t("events", "Events")}
            </Link>
            <Link to="/talents" className="hover:text-white transition">
              {t("talent", "Talent")}
            </Link>
            <Link to="/recruiting" className="hover:text-white transition">
              {t("recruiting", "Recruiting")}
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white transition">
              <Search size={18} />
            </button>
            <Link
              to="/login"
              className="text-sm font-medium text-slate-400 hover:text-white transition"
            >
              {t("login", "Log In")}
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-medium px-4 py-2 rounded-md transition border border-blue-500/50"
            >
              {t("join", "Join")}
            </Link>
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-slate-800 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2025 EventHub Platform. Built for builders in Kazakhstan 🇰🇿
            </p>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <a href="#" className="text-slate-500 hover:text-slate-400 text-sm">Twitter</a>
              <a href="#" className="text-slate-500 hover:text-slate-400 text-sm">Telegram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
