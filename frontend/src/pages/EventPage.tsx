import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { kk } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { getEvent, updateEvent } from "../services/events.service";
import type { Event } from "../types/event.types";

export function EventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;
    getEvent(Number(eventId))
      .then(setEvent)
      .catch(() => setError("event_not_found"))
      .finally(() => setLoading(false));
  }, [eventId]);

  if (loading) {
    return <p className="p-10 text-center text-sm text-slate-500">{t("loading")}</p>;
  }

  if (error || !event) {
    return (
      <div className="p-10 text-center">
        <p className="text-sm text-red-500">{t(error ?? "event_not_found")}</p>
        <Link to="/events" className="mt-4 inline-flex text-slate-900">
          {t("back_to_catalog")}
        </Link>
      </div>
    );
  }

  const start = format(new Date(event.date_start), "d MMMM, HH:mm", { locale: kk });
  const end = event.date_end ? format(new Date(event.date_end), "d MMMM, HH:mm", { locale: kk }) : null;

  const joinEvent = async () => {
    await updateEvent(event.id, {});
    navigate(0);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-slate-700">
        {t("back_to_catalog")}
      </button>

      <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">{event.is_online ? t("online") : t("offline")}</p>
            <h1 className="text-4xl font-bold text-slate-900">{event.title}</h1>
            <p className="mt-2 text-slate-600">{event.description}</p>
          </div>
          <span className="rounded-full bg-slate-100 px-4 py-1 text-sm font-semibold text-slate-700">
            {t(`type_${event.type}`)}
          </span>
        </div>

        <dl className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">{t("organizer")}</dt>
            <dd className="text-lg font-medium text-slate-900">#{event.organizer_id}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">{t("location")}</dt>
            <dd className="text-lg font-medium text-slate-900">{event.city || (event.is_online ? t("online") : "-")}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">{t("date")}</dt>
            <dd className="text-lg font-medium text-slate-900">
              {start}{end ? ` — ${end}` : ""}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">{t("join")}</dt>
            <dd>
              <button
                onClick={joinEvent}
                className="mt-1 inline-flex items-center rounded-2xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
              >
                {t("join")}
              </button>
            </dd>
          </div>
        </dl>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">{t("requirements")}</h2>
          <ul className="mt-3 list-disc space-y-1 pl-6 text-slate-600">
            {!event.requirements && <li>{t("no_requirements")}</li>}
            {event.requirements && (
              <li>{event.requirements}</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
