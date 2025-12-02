import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  Users, 
  Calendar, 
  BarChart3, 
  RefreshCw, 
  LogOut, 
  Shield,
  TrendingUp,
  Activity
} from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface Stats {
  users: {
    total: number;
    active: number;
  };
  events: {
    total: number;
  };
}

interface User {
  id: number;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface Event {
  id: number;
  title: string;
  date_start: string;
  city: string | null;
  is_online: boolean;
  type: string;
}

export function AdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [activeTab, setActiveTab] = useState<"stats" | "users" | "events">("stats");

  const isAuthenticated = () => {
    return !!localStorage.getItem("access_token");
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/stats`, {
        headers: getAuthHeaders(),
      });
      setStats(response.data);
    } catch (err: any) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        alert("У вас нет доступа к админ панели. Требуется роль администратора.");
        navigate("/");
      }
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: getAuthHeaders(),
      });
      setUsers(response.data);
    } catch (err: any) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/events`, {
        headers: getAuthHeaders(),
      });
      setEvents(response.data);
    } catch (err: any) {
      console.error("Error fetching events:", err);
    }
  };

  const handleRunScraper = async () => {
    setScraping(true);
    try {
      const response = await axios.post(`${API_URL}/admin/run-scraper`, {}, {
        headers: getAuthHeaders(),
      });
      alert(`Парсинг завершен! Обработано событий: ${Object.values(response.data).reduce((a: number, b: number) => a + b, 0)}`);
      if (activeTab === "events") {
        fetchEvents();
      }
    } catch (err: any) {
      alert(`Ошибка: ${err.response?.data?.detail || err.message}`);
    } finally {
      setScraping(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "events") {
      fetchEvents();
    }
  }, [activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="text-blue-400" size={24} />
              <h1 className="text-2xl font-bold text-white">Админ Панель</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition"
            >
              <LogOut size={18} />
              Выйти
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-800">
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === "stats"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <BarChart3 size={18} />
              Статистика
            </div>
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === "users"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={18} />
              Пользователи
            </div>
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === "events"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              События
            </div>
          </button>
        </div>

        {/* Content */}
        {activeTab === "stats" && stats && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="text-blue-400" size={24} />
                  <TrendingUp className="text-green-400" size={20} />
                </div>
                <h3 className="text-slate-400 text-sm mb-1">Всего пользователей</h3>
                <p className="text-3xl font-bold text-white">{stats.users.total}</p>
                <p className="text-sm text-slate-500 mt-2">
                  Активных: {stats.users.active}
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="text-purple-400" size={24} />
                  <Activity className="text-green-400" size={20} />
                </div>
                <h3 className="text-slate-400 text-sm mb-1">Всего событий</h3>
                <p className="text-3xl font-bold text-white">{stats.events.total}</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <RefreshCw className="text-orange-400" size={24} />
                </div>
                <h3 className="text-slate-400 text-sm mb-1">Парсинг событий</h3>
                <button
                  onClick={handleRunScraper}
                  disabled={scraping}
                  className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} className={scraping ? "animate-spin" : ""} />
                  {scraping ? "Парсинг..." : "Запустить парсинг"}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Роль
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Дата регистрации
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          user.role === "admin" 
                            ? "bg-red-500/20 text-red-400" 
                            : "bg-blue-500/20 text-blue-400"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          user.is_active 
                            ? "bg-green-500/20 text-green-400" 
                            : "bg-gray-500/20 text-gray-400"
                        }`}>
                          {user.is_active ? "Активен" : "Неактивен"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        {new Date(user.created_at).toLocaleDateString("ru-RU")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "events" && (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>{new Date(event.date_start).toLocaleDateString("ru-RU")}</span>
                      {event.city && <span>📍 {event.city}</span>}
                      {event.is_online && <span>🌐 Онлайн</span>}
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                        {event.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

