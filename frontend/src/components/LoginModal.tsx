import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { X, Upload, Mail, Lock, FileText, UserPlus } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowedTypes.includes(file.type)) {
        setError("Поддерживаются только файлы PDF, DOC и DOCX");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Размер файла не должен превышать 10MB");
        return;
      }
      setResume(file);
      setResumeName(file.name);
      setError("");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // OAuth2PasswordRequestForm требует URLSearchParams
      const params = new URLSearchParams();
      params.append("username", email);
      params.append("password", password);

      const response = await axios.post(`${API_URL}/auth/login`, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.data?.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Ошибка при входе. Проверьте email и пароль.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      if (resume) {
        formData.append("resume", resume);
      }

        const response = await axios.post(`${API_URL}/auth/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        // Автоматически логиним пользователя
        const loginParams = new URLSearchParams();
        loginParams.append("username", email);
        loginParams.append("password", password);
        
        const loginResponse = await axios.post(`${API_URL}/auth/login`, loginParams, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        if (loginResponse.data?.access_token) {
          localStorage.setItem("access_token", loginResponse.data.access_token);
          localStorage.setItem("refresh_token", loginResponse.data.refresh_token);
          onSuccess();
          onClose();
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Ошибка при регистрации. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {isLogin ? t("login_title", "Вход") : t("register_title", "Регистрация")}
                </h2>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6 p-1 bg-slate-800 rounded-lg">
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setError("");
                  }}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition ${
                    isLogin
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {t("login", "Войти")}
                </button>
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setError("");
                  }}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition ${
                    !isLogin
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {t("register", "Регистрироваться")}
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="modal-email" className="block text-sm font-medium text-slate-300 mb-2">
                    {t("email", "Email")}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      id="modal-email"
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
                  <label htmlFor="modal-password" className="block text-sm font-medium text-slate-300 mb-2">
                    {t("password", "Пароль")}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      id="modal-password"
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

                {/* Resume Upload - только для регистрации */}
                {!isLogin && (
                  <div>
                    <label htmlFor="modal-resume" className="block text-sm font-medium text-slate-300 mb-2">
                      {t("resume", "Резюме")} <span className="text-slate-500">({t("optional", "необязательно")})</span>
                    </label>
                    <div className="relative">
                      <input
                        id="modal-resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                        required={!isLogin}
                      />
                      <label
                        htmlFor="modal-resume"
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
                              {t("upload_resume_required", "Загрузить резюме (обязательно)")}
                            </p>
                          )}
                        </div>
                      </label>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      {t("resume_hint", "Максимальный размер: 10MB. Поддерживаются форматы: PDF, DOC, DOCX")}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/30"
                >
                  {loading
                    ? (isLogin ? t("logging_in", "Вход...") : t("registering", "Регистрация..."))
                    : (isLogin ? t("login", "Войти") : t("register", "Регистрироваться"))
                  }
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

