import { useTranslation } from "react-i18next";
import { EventCard } from "../components/EventCard";
import type { Event } from "../types";

// Astana Hub Events
const ASTANA_HUB_EVENTS: Event[] = [
  {
    id: 1,
    title: "Стань Scrum-мастером за 2 дня!",
    description: "Интенсив от Astana Hub: обучись Scrum и Agile за 2 дня и получи шанс пройти стажировку.",
    date_start: new Date("2025-11-28T09:00:00").toISOString(),
    date_end: new Date("2025-11-29T13:00:00").toISOString(),
    city: null,
    is_online: true,
    type: "seminar",
    organizer_id: null,
    requirements: null,
    source: "external",
    banner: null,
    source_url: "https://astanahub.com/en/event/stan-scrum-masterom-za-2-dnia",
    tags: ["Scrum", "Agile"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Pizza Pitch! 🍕",
    description: "Питчинг для стартапов. Призовой фонд — 1 500 000 ₸. Возможность выступить перед инвесторами.",
    date_start: new Date("2025-12-25T15:30:00").toISOString(),
    date_end: null,
    city: "Астана",
    is_online: false,
    type: "tournament",
    organizer_id: null,
    requirements: null,
    source: "external",
    banner: null,
    source_url: "https://astanahub.com/en/event/pizza-pitch1763379282",
    tags: ["Стартап", "Питчинг"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: "👑 IT Queen: твой проект заслуживает корону!",
    description: "Конкурс для женщин-предпринимательниц. Питчинг на сцене Astana Hub.",
    date_start: new Date("2025-11-28T16:00:00").toISOString(),
    date_end: null,
    city: "Астана",
    is_online: false,
    type: "tournament",
    organizer_id: null,
    requirements: null,
    source: "external",
    banner: null,
    source_url: "https://astanahub.com/en/event/it-queen-tvoi-proekt-zasluzhivaet-koronu1762510308",
    tags: ["Стартап", "Женщины"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Воркшоп: Преврати хаос в порядок: собери свою систему в Notion за 2 часа",
    description: "Практический воркшоп по созданию личной системы в Notion за 2 часа.",
    date_start: new Date("2025-11-28T15:00:00").toISOString(),
    date_end: new Date("2025-11-28T17:00:00").toISOString(),
    city: "Astana Hub",
    is_online: false,
    type: "seminar",
    organizer_id: null,
    requirements: null,
    source: "external",
    banner: null,
    source_url: "https://astanahub.com/en/event/vorkshop-prevrati-khaos-v-poriadok-soberi-svoiu-sistemu-v-notion-za-2-chasa",
    tags: ["Notion", "Продуктивность"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    title: "Market Entry Accelerator Demo Day",
    description: "Demo Day для узбекских стартапов, проходящих акселерацию в Казахстане.",
    date_start: new Date("2025-12-02T16:00:00").toISOString(),
    date_end: null,
    city: "Астана",
    is_online: false,
    type: "tournament",
    organizer_id: null,
    requirements: null,
    source: "external",
    banner: null,
    source_url: "https://astanahub.com/en/event/demo-day-market-entry-accelerator",
    tags: ["Стартап", "Акселератор"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    title: "Agile-сессия с Ясминой Умархановой",
    description: "Agile-сессия от эксперта международной компании. Онлайн-включение из Италии.",
    date_start: new Date("2025-12-09T16:00:00").toISOString(),
    date_end: null,
    city: "Astana Hub Cinema Hall",
    is_online: false,
    type: "seminar",
    organizer_id: null,
    requirements: null,
    source: "external",
    banner: null,
    source_url: "https://astanahub.com",
    tags: ["Agile", "Менеджмент"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 7,
    title: "IEEE Smart Information Systems Conference (SIST)",
    description: "Крупнейшая IT-конференция IEEE в Казахстане. Темы: AI, IoT, Robotics, Data Science.",
    date_start: new Date("2026-05-13T09:00:00").toISOString(),
    date_end: null,
    city: "Астана",
    is_online: false,
    type: "seminar",
    organizer_id: null,
    requirements: null,
    source: "external",
    banner: null,
    source_url: "https://astanahub.com",
    tags: ["AI", "IoT", "Robotics"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 8,
    title: "Kazakhstan Security Systems",
    description: "Главная выставка по безопасности в Центральной Азии. Более 90 компаний-участников.",
    date_start: new Date("2026-05-13T09:00:00").toISOString(),
    date_end: new Date("2026-05-15T18:00:00").toISOString(),
    city: "Astana EXPO",
    is_online: false,
    type: "seminar",
    organizer_id: null,
    requirements: null,
    source: "external",
    banner: null,
    source_url: "https://astanahub.com",
    tags: ["Безопасность", "Выставка"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 9,
    title: "Business Technology Expo",
    description: "Международная выставка по цифровым технологиям и автоматизации бизнеса.",
    date_start: new Date("2026-05-13T09:00:00").toISOString(),
    date_end: new Date("2026-05-15T18:00:00").toISOString(),
    city: "Astana EXPO",
    is_online: false,
    type: "seminar",
    organizer_id: null,
    requirements: null,
    source: "external",
    banner: null,
    source_url: "https://astanahub.com",
    tags: ["Технологии", "Бизнес"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 10,
    title: "Digital Generation 2026 (Student Conference)",
    description: "Студенческая научная конференция: AI, Robotics, Communications, Engineering.",
    date_start: new Date("2026-10-21T09:00:00").toISOString(),
    date_end: null,
    city: "Астана",
    is_online: false,
    type: "seminar",
    organizer_id: null,
    requirements: null,
    source: "external",
    banner: null,
    source_url: "https://astanahub.com",
    tags: ["Студенты", "Наука"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// College Events
const COLLEGE_EVENTS: Event[] = [
  {
    id: 11,
    title: "AITU College — Python Day",
    description: "Интенсив по Python для начинающих.",
    date_start: new Date("2025-12-04T10:00:00").toISOString(),
    date_end: null,
    city: "AITU College",
    is_online: false,
    type: "seminar",
    organizer_id: null,
    requirements: null,
    source: null,
    banner: null,
    source_url: null,
    tags: ["Python", "Обучение"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 12,
    title: "Energy College — IT Battle",
    description: "Соревнование команд по решению задач.",
    date_start: new Date("2025-12-07T14:00:00").toISOString(),
    date_end: null,
    city: "Energy College",
    is_online: false,
    type: "tournament",
    organizer_id: null,
    requirements: null,
    source: null,
    banner: null,
    source_url: null,
    tags: ["Соревнование", "IT"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 13,
    title: "Сервисный колледж — Arduino Lab",
    description: "Практический воркшоп по Arduino.",
    date_start: new Date("2025-12-10T11:00:00").toISOString(),
    date_end: null,
    city: "Сервисный колледж",
    is_online: false,
    type: "seminar",
    organizer_id: null,
    requirements: null,
    source: null,
    banner: null,
    source_url: null,
    tags: ["Arduino", "Электроника"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 14,
    title: "Polytechnic — Digital Skills Meetup",
    description: "Митап по цифровым навыкам.",
    date_start: new Date("2025-12-08T15:00:00").toISOString(),
    date_end: null,
    city: "Polytechnic",
    is_online: false,
    type: "seminar",
    organizer_id: null,
    requirements: null,
    source: null,
    banner: null,
    source_url: null,
    tags: ["Митап", "Навыки"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function EventsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Events
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Upcoming activities for students of Astana.
          </p>
          {/* Astana Hub Logo */}
          <div className="flex justify-center">
            <img 
              src="https://astanahub.com/static/images/logo.svg" 
              alt="Astana Hub" 
              className="h-12 object-contain brightness-0 invert"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Astana Hub Events */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Astana Hub Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            {ASTANA_HUB_EVENTS.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* College Events */}
        <section>
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            College Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            {COLLEGE_EVENTS.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
          </div>
        </section>
        </div>
    </div>
  );
}
