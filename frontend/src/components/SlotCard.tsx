import { format } from "date-fns";
import { kk } from "date-fns/locale";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Puzzle, MapPin, Clock, DollarSign } from "lucide-react";
import type { Slot } from "../types";

interface Props {
  slot: Slot;
}

export function SlotCard({ slot }: Props) {
  const { t } = useTranslation();
  const start = format(new Date(slot.slot_start), "d MMM, HH:mm", { locale: kk });
  const end = format(new Date(slot.slot_end), "HH:mm", { locale: kk });

  return (
    <article className="flex flex-col rounded-3xl border border-slate-700 bg-slate-800/50 p-6 shadow-lg transition-all hover:-translate-y-1 hover:border-green-500/50 hover:shadow-green-500/10">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Puzzle size={16} className="text-green-400" />
          <span className="text-xs font-semibold text-green-400 uppercase tracking-wide">
            {t("intern_tetris", "Стаж-Тетрис")}
          </span>
        </div>
        <span className="text-xs font-medium text-slate-400">
          {slot.duration_hours}h
        </span>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{slot.title}</h3>
      <p className="text-sm text-slate-400 line-clamp-2 mb-4">{slot.description}</p>

      {slot.operation && (
        <div className="mb-3">
          <span className="text-xs text-slate-500">{t("operation", "Операция")}: </span>
          <span className="text-sm font-medium text-slate-300">{slot.operation}</span>
        </div>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Clock size={14} className="text-slate-500" />
          <span>{start} - {end}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <MapPin size={14} className="text-slate-500" />
          <span>{slot.city || slot.address}</span>
        </div>
        {slot.payment && (
          <div className="flex items-center gap-2 text-sm font-semibold text-green-400">
            <DollarSign size={14} />
            <span>{slot.payment} ₸</span>
          </div>
        )}
      </div>

      {slot.required_skills && slot.required_skills.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {slot.required_skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full font-medium"
              >
                {skill}
              </span>
            ))}
            {slot.required_skills.length > 3 && (
              <span className="px-2 py-1 text-xs text-slate-500">
                +{slot.required_skills.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="mt-auto pt-4">
        <Link
          to={`/internship/slots/${slot.id}`}
          className="inline-flex items-center justify-center w-full rounded-xl bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 text-sm font-semibold transition-all transform hover:scale-105"
        >
          {t("apply", "Подать заявку")}
        </Link>
      </div>
    </article>
  );
}

