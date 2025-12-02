import { Link } from "react-router-dom";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import type { Event } from "../types";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const start = new Date(event.date_start);
  const end = event.date_end ? new Date(event.date_end) : null;
  
  const dateStr = end
    ? `${start.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })} - ${end.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}`
    : start.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });

  const timeStr = start.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  const location = event.is_online ? "Online" : event.city || "Astana";

  return (
    <Link
      to={`/events/${event.id}`}
      className="group bg-slate-800/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 border border-slate-700/50 hover:border-blue-500/50 hover:-translate-y-1"
    >
      {/* Content - без изображения */}
      <div className="p-6">
        {/* Date & Location */}
        <div className="flex items-center gap-3 mb-4 text-sm text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar size={16} className="text-blue-400" />
            <span className="font-medium">{dateStr}</span>
            {timeStr && <span className="text-slate-500">• {timeStr}</span>}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-5">
          <MapPin size={16} className="text-blue-400" />
          <span>{location}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-slate-300 text-sm leading-relaxed mb-6 line-clamp-3">
          {event.description}
        </p>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-md bg-slate-700/50 text-slate-300 text-xs border border-slate-600/50"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Learn More Button */}
        <div className="flex items-center text-blue-400 font-medium text-sm group-hover:gap-2 transition-all pt-4 border-t border-slate-700/50">
          <span>Learn More</span>
          <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
        </div>
      </div>
    </Link>
  );
}
