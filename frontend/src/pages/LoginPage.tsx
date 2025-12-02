import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import axios from "axios";
import LiquidEther from "../components/LiquidEther";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Показываем сообщение об успешной регистрации если есть
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      // OAuth2PasswordRequestForm требует URLSearchParams, а не FormData
      const params = new URLSearchParams();
      params.append("username", email); // OAuth2PasswordRequestForm использует username (но это email)
      params.append("password", password);

      const response = await axios.post(`${API_URL}/auth/login`, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.data?.access_token) {
        // Сохраняем токен
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        
        // Перенаправляем на страницу возврата или главную
        const returnTo = location.state?.returnTo || "/";
        navigate(returnTo);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Ошибка при входе. Проверьте email и пароль.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 relative overflow-hidden">
      {/* Liquid Ether Background */}
      <div className="absolute inset-0 z-0">
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950/70 pointer-events-none" />
      
      <div className="relative z-[2] min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Back button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
          >
            <ArrowLeft size={18} />
            <span>Назад на главную</span>
          </Link>

          {/* Form Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                {t("login_title", "Вход")}
              </h1>
              <p className="text-slate-400">
                {t("login_subtitle", "Войдите в свой аккаунт")}
              </p>
            </div>

            {successMessage && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  {t("email", "Email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  {t("password", "Пароль")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/30"
              >
                {loading ? t("logging_in", "Вход...") : t("login", "Войти")}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                {t("no_account", "Нет аккаунта?")}{" "}
                <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                  {t("register", "Зарегистрироваться")}
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

