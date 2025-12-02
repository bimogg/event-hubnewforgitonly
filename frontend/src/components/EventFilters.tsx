import type { EventFilters, EventType } from "../types/event.types";
import { useTranslation } from "react-i18next";

interface Props {
  value: EventFilters;
  onChange: (next: EventFilters) => void;
}

const typeOptions: { value: EventType | "all"; key: string }[] = [
  { value: "all", key: "filter_all" },
  { value: "hackathon", key: "type_hackathon" },
  { value: "meetup", key: "type_meetup" },
  { value: "tournament", key: "type_tournament" },
  { value: "lecture", key: "type_lecture" },
  { value: "workshop", key: "type_workshop" },
];

const sortOptions = [
  { value: "upcoming", key: "filter_upcoming" },
  { value: "newest", key: "filter_newest" },
  { value: "oldest", key: "filter_oldest" },
];

export function EventFilters({ value, onChange }: Props) {
  const { t } = useTranslation();
  const onlineOptions = [
    { value: "all", key: "filter_all" },
    { value: true, key: "filter_online" },
    { value: false, key: "filter_offline" },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="query" className="text-sm font-medium text-slate-600">
            {t("search")}
          </label>
          <input
            id="query"
            type="text"
            value={value.query ?? ""}
            onChange={(e) => onChange({ ...value, query: e.target.value })}
            placeholder={t("search_placeholder")}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-600">{t("type")}</label>
          <select
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={value.type ?? "all"}
            onChange={(e) => onChange({ ...value, type: e.target.value as EventType | "all" })}
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.key)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-600">{t("format")}</label>
          <select
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={value.is_online ?? "all"}
            onChange={(e) =>
              onChange({ ...value, is_online: e.target.value === "all" ? "all" : e.target.value === "true" })
            }
          >
            {onlineOptions.map((option) => (
              <option key={String(option.value)} value={String(option.value)}>
                {t(option.key)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-600">{t("sort")}</label>
          <select
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={value.sort ?? "upcoming"}
            onChange={(e) => onChange({ ...value, sort: e.target.value as EventFilters["sort"] })}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.key)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
