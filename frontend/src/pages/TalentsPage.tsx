import { useTranslation } from "react-i18next";
import { Award, Trophy, Medal, ExternalLink, MapPin, Calendar } from "lucide-react";

// Призёры событий
const winners = [
  {
    id: 1,
    name: "Алия Сарсенова",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    place: 1,
    event: "HackNU 2024",
    eventType: "Хакатон",
    prize: "700 000 ₸",
    city: "Астана",
    date: "15-17 апреля 2024",
    skills: ["React", "Node.js", "AI/ML"],
    university: "Nazarbayev University",
    project: "AI-powered HealthTech решение для диагностики",
    description: "Победитель крупнейшего хакатона в Казахстане. Разработала инновационное решение с использованием машинного обучения.",
  },
  {
    id: 2,
    name: "Руслан Касымов",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    place: 2,
    event: "Astana Hub Tech Challenge 2024",
    eventType: "Хакатон",
    prize: "500 000 ₸",
    city: "Астана",
    date: "10-12 мая 2024",
    skills: ["Golang", "PostgreSQL", "Docker", "Kubernetes"],
    university: "KBTU",
    project: "Масштабируемая платформа для финтех-стартапов",
    description: "Второе место в технологическом конкурсе. Специалист по высоконагруженным системам.",
  },
  {
    id: 3,
    name: "Дина Мухамеджанова",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    place: 1,
    event: "IT Queen 2024",
    eventType: "Конкурс",
    prize: "600 000 ₸",
    city: "Астана",
    date: "28 ноября 2024",
    skills: ["React", "Three.js", "UI/UX Design"],
    university: "IITU",
    project: "Инновационная платформа для e-commerce",
    description: "Победительница конкурса для женщин-предпринимательниц. Создала успешный стартап в сфере e-commerce.",
  },
  {
    id: 4,
    name: "Асхат Нурланов",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    place: 3,
    event: "Pizza Pitch 2024",
    eventType: "Питчинг",
    prize: "300 000 ₸",
    city: "Астана",
    date: "25 декабря 2024",
    skills: ["Python", "FastAPI", "Blockchain"],
    university: "AITU",
    project: "Blockchain-решение для прозрачности в госсекторе",
    description: "Третье место в питч-сессии. Разработал инновационное blockchain-решение.",
  },
  {
    id: 5,
    name: "Амина Жумабекова",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    place: 1,
    event: "KBTU Innovation Hackathon 2024",
    eventType: "Хакатон",
    prize: "Главный приз",
    city: "Алматы",
    date: "20-22 марта 2024",
    skills: ["Vue.js", "Django", "Mobile Development"],
    university: "KBTU",
    project: "Мобильное приложение для образования",
    description: "Победительница хакатона от KBTU. Создала мобильное приложение с использованием современных технологий.",
  },
  {
    id: 6,
    name: "Данияр Абдуллаев",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    place: 2,
    event: "Scrum Master Competition 2024",
    eventType: "Конкурс",
    prize: "Сертификат + стажировка",
    city: "Онлайн",
    date: "15 октября 2024",
    skills: ["Scrum", "Agile", "Project Management"],
    university: "NU",
    project: "Внедрение Agile-методологий в стартап",
    description: "Второе место в конкурсе Scrum-мастеров. Эксперт по гибким методологиям разработки.",
  },
];

export function TalentsPage() {
  const { t } = useTranslation();

  const getPlaceIcon = (place: number) => {
    if (place === 1) return <Trophy className="text-yellow-400" size={24} />;
    if (place === 2) return <Medal className="text-slate-300" size={24} />;
    if (place === 3) return <Medal className="text-amber-600" size={24} />;
    return <Award className="text-blue-400" size={24} />;
  };

  const getPlaceBadge = (place: number) => {
    if (place === 1) return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white";
    if (place === 2) return "bg-gradient-to-r from-slate-300 to-slate-400 text-slate-900";
    if (place === 3) return "bg-gradient-to-r from-amber-600 to-amber-700 text-white";
    return "bg-blue-600 text-white";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            {t("talents_page_title", "Победители событий")}
          </h1>
          <p className="text-lg text-slate-400">
            {t("talents_page_subtitle", "Таланты, которые заняли призовые места в хакатонах и конкурсах")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {winners.map((winner) => (
            <div
              key={winner.id}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition group"
            >
              {/* Header with photo and place */}
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={winner.photo}
                        alt={winner.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-slate-700"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(winner.name)}&background=2563eb&color=fff&size=128`;
                        }}
                      />
                      <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full ${getPlaceBadge(winner.place)} flex items-center justify-center text-xs font-bold shadow-lg`}>
                        {winner.place}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{winner.name}</h3>
                      <p className="text-slate-400 text-sm">{winner.university}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {getPlaceIcon(winner.place)}
                    <span className="text-xs text-slate-400 font-medium">
                      {winner.place === 1 ? t("first_place", "1 место") : 
                       winner.place === 2 ? t("second_place", "2 место") : 
                       winner.place === 3 ? t("third_place", "3 место") : 
                       t("winner", "Победитель")}
                    </span>
                  </div>
                </div>

                  {/* Event info - упрощенная */}
                <div className="bg-slate-800/50 rounded-lg p-2.5 mb-2">
                  <h4 className="text-white font-semibold text-sm mb-1 line-clamp-1">{winner.event}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{winner.date}</span>
                    <span>•</span>
                    <span>{winner.city}</span>
                  </div>
                </div>

                {/* Prize - упрощенная */}
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-2">
                  <span className="text-xs font-bold text-blue-400">{winner.prize}</span>
                </div>
              </div>

              {/* Content - упрощенная */}
              <div className="p-5">
                {/* Skills */}
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1.5">
                    {winner.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="text-xs text-slate-400 bg-slate-800 border border-slate-700 px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

