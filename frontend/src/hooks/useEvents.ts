import { useState, useEffect } from "react";
import { getEvents, getSlots } from "../services/events.service";
import type { Event, Slot } from "../types";

// СТАТИЧЕСКИЕ СОБЫТИЯ ДЛЯ ОТОБРАЖЕНИЯ
const STATIC_EVENTS: Event[] = [
  {
    id: 1,
    title: "Стань Scrum-мастером за 2 дня!",
    description: "На Scrum School от Astana Hub ты освоишь гибкие методологии Scrum и Agile, чтобы управлять командами и проектами так, как это делают ведущие IT-компании мира.",
    date_start: new Date("2025-11-28T09:00:00").toISOString(),
    date_end: new Date("2025-11-29T13:00:00").toISOString(),
    city: "Астана",
    is_online: true,
    type: "seminar",
    banner: "https://astanahub.com/static/images/logo.svg",
    source_url: "https://astanahub.com/en/event/stan-scrum-masterom-za-2-dnia",
    tags: ["Scrum", "Agile", "Управление"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Pizza Pitch! 🍕",
    description: "Стартап на стадии MVP и выше? Представь свой проект экспертам и инвесторам — и поборись за призовой фонд 1 500 000 ₸.",
    date_start: new Date("2025-11-18T15:00:00").toISOString(),
    date_end: null,
    city: "Астана",
    is_online: false,
    type: "tournament",
    banner: "https://astanahub.com/static/images/logo.svg",
    source_url: "https://astanahub.com/en/event/pizza-pitch1763379282",
    tags: ["Стартап", "Питчинг", "Инвестиции"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: "👑 IT Queen: твой проект заслуживает корону!",
    description: "Конкурс для женщин-предпринимательниц и стартапов на стадии MVP. Питчинг перед экспертами, менторами и инвесторами.",
    date_start: new Date("2025-11-28T15:30:00").toISOString(),
    date_end: null,
    city: "Астана",
    is_online: false,
    type: "tournament",
    banner: "https://astanahub.com/static/images/logo.svg",
    source_url: "https://astanahub.com/en/event/it-queen-tvoi-proekt-zasluzhivaet-koronu1762510308",
    tags: ["Стартап", "Женщины", "Конкурс"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Воркшоп: Преврати хаос в порядок: собери свою систему в Notion за 2 часа",
    description: "На этом воркшопе мы начнём с пустой страницы и соберём вашу личную систему управления жизнью и задачами — прямо в реальном времени.",
    date_start: new Date("2025-11-28T15:00:00").toISOString(),
    date_end: new Date("2025-11-28T17:00:00").toISOString(),
    city: null,
    is_online: true,
    type: "seminar",
    banner: "https://astanahub.com/static/images/logo.svg",
    source_url: "https://astanahub.com/en/event/vorkshop-prevrati-khaos-v-poriadok-soberi-svoiu-sistemu-v-notion-za-2-chasa",
    tags: ["Notion", "Продуктивность", "Воркшоп"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    title: "Как спроектировать приложение, которое выдержит миллион пользователей?",
    description: "Мастер-класс от Влада Мишустина — основателя Warpflow и бывшего технического директора.",
    date_start: new Date("2025-11-26T16:00:00").toISOString(),
    date_end: null,
    city: null,
    is_online: true,
    type: "seminar",
    banner: "https://astanahub.com/static/images/logo.svg",
    source_url: "https://astanahub.com/en/event/demo-day-market-entry-accelerator",
    tags: ["Разработка", "Архитектура", "Масштабирование"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    title: "HackNU 2025 - Крупнейший хакатон в Казахстане",
    description: "Ежегодный хакатон от Nazarbayev University. Соревнование по разработке инновационных решений в области AI, HealthTech и FinTech.",
    date_start: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    date_end: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString(),
    city: "Астана",
    is_online: false,
    type: "hackathon",
    banner: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Nazarbayev_University_logo.svg/200px-Nazarbayev_University_logo.svg.png",
    source_url: "https://nu.edu.kz/hackathon",
    tags: ["AI", "HealthTech", "FinTech", "NU"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 7,
    title: "Astana Hub Startup Day",
    description: "День открытых дверей и питчей стартапов в Astana Hub. Представь свой проект экспертам и инвесторам.",
    date_start: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    date_end: null,
    city: "Астана",
    is_online: false,
    type: "tournament",
    banner: "https://astanahub.com/static/images/logo.svg",
    source_url: "https://astanahub.com",
    tags: ["Стартап", "Питчинг", "Astana Hub"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function useEvents() {
  const [events, setEvents] = useState<Event[]>(STATIC_EVENTS); // Сразу показываем статические события
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false); // Не показываем загрузку
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      // Пробуем загрузить из API, но если не получится - оставляем статические
      const [eventsRes, slotsRes] = await Promise.all([
        getEvents().catch((err) => {
          console.error("❌ Error fetching events:", err);
          return { items: STATIC_EVENTS, total: STATIC_EVENTS.length }; // Возвращаем статические
        }),
        getSlots().catch((err) => {
          console.error("Error fetching slots:", err);
          return { items: [], total: 0 };
        })
      ]);

      const eventsList = eventsRes.items && eventsRes.items.length > 0 ? eventsRes.items : STATIC_EVENTS;
      const slotsList = slotsRes.items || [];
      
      setEvents(eventsList);
      setSlots(slotsList);
      setLoading(false);
    } catch (err) {
      console.error("Error in fetchData:", err);
      // При ошибке оставляем статические события
      setEvents(STATIC_EVENTS);
      setSlots([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Сразу показываем статические события, потом пытаемся загрузить из API
    fetchData();
  }, []);

  return { events, slots, loading, error, refetch: fetchData };
}
