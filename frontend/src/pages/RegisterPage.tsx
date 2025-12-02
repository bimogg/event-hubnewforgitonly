import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Upload, Mail, Lock, FileText, ArrowLeft } from "lucide-react";
import axios from "axios";
import LiquidEther from "../components/LiquidEther";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Проверяем формат файла
      const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowedTypes.includes(file.type)) {
        setError("Поддерживаются только файлы PDF, DOC и DOCX");
        return;
      }
      // Проверяем размер (макс 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("Размер файла не должен превышать 10MB");
        return;
      }
      setResume(file);
      setResumeName(file.name);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Проверяем, что резюме загружено
    if (!resume) {
      setError("Резюме обязательно для регистрации. Пожалуйста, загрузите файл резюме.");
      return;
    }
    
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("resume", resume); // Теперь всегда добавляем резюме

      // Устанавливаем таймаут для быстрого ответа
      const response = await axios.post(`${API_URL}/auth/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 5000, // 5 секунд максимум
      });

      if (response.data) {
        // Сразу перенаправляем - не ждем автоматический вход
        navigate("/");
        
        // Автоматически логиним пользователя в фоне (не блокируя перенаправление)
        const loginParams = new URLSearchParams();
        loginParams.append("username", email);
        loginParams.append("password", password);
        
        axios.post(`${API_URL}/auth/login`, loginParams, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          timeout: 3000, // 3 секунды максимум
        }).then((loginResponse) => {
          if (loginResponse.data?.access_token) {
            localStorage.setItem("access_token", loginResponse.data.access_token);
            localStorage.setItem("refresh_token", loginResponse.data.refresh_token);
            // Обновляем страницу для применения авторизации
            window.location.reload(); 
            
          }
        }).catch(() => {
          // Игнорируем ошибки автоматического входа
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Ошибка при регистрации. Попробуйте снова.");
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
                {t("register_title", "Регистрация")}
              </h1>
              <p className="text-slate-400">
                {t("register_subtitle", "Создайте аккаунт и загрузите резюме")}
              </p>
            </div>

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
                    minLength={6}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Resume Upload */}
              <div>
                <label htmlFor="resume" className="block text-sm font-medium text-slate-300 mb-2">
                  {t("resume", "Резюме")} <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    required
                    className="hidden"
                  />
                  <label
                    htmlFor="resume"
                    className="flex items-center gap-3 p-4 bg-slate-800 border border-slate-700 rounded-lg cursor-pointer hover:border-blue-500/50 transition"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      {resume ? (
                        <FileText className="text-blue-400" size={20} />
                      ) : (
                        <Upload className="text-blue-400" size={20} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {resumeName ? (
                        <p className="text-sm text-white truncate">{resumeName}</p>
                      ) : (
                        <p className="text-sm text-slate-400">
                          {t("upload_resume_placeholder", "Загрузить PDF, DOC или DOCX")}
                        </p>
                      )}
                    </div>
                  </label>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {t("resume_hint", "Максимальный размер: 10MB. Поддерживаются форматы: PDF, DOC, DOCX")}
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/30"
              >
                {loading ? t("registering", "Регистрация...") : t("register", "Зарегистрироваться")}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                {t("already_have_account", "Уже есть аккаунт?")}{" "}
                <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                  {t("login", "Войти")}
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

