import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { createEvent } from "../services/events.service";
import type { EventType } from "../types/event.types";

interface FormValues {
  title: string;
  description: string;
  type: EventType;
  location: string;
  is_online: boolean;
  start_date: string;
  end_date: string;
  requirements: { value: string }[];
}

const defaultValues: FormValues = {
  title: "",
  description: "",
  type: "hackathon",
  location: "",
  is_online: false,
  start_date: "",
  end_date: "",
  requirements: [{ value: "" }],
};

export function CreateEventPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ name: "requirements", control });

  const onSubmit = async (values: FormValues) => {
    const payload = {
      ...values,
      requirements: values.requirements.map((req) => req.value).filter(Boolean),
    };
    const event = await createEvent(payload);
    navigate(`/events/${event.id}`);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-slate-700">
          {t("back")}
        </button>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{t("create_event")}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-600">{t("title")}</label>
            <input
              {...register("title", { required: t("title") })}
              className="rounded-xl border border-slate-200 px-3 py-2"
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-600">{t("type")}</label>
            <select {...register("type")} className="rounded-xl border border-slate-200 px-3 py-2">
              <option value="hackathon">{t("type_hackathon")}</option>
              <option value="meetup">{t("type_meetup")}</option>
              <option value="tournament">{t("type_tournament")}</option>
              <option value="lecture">{t("type_lecture")}</option>
              <option value="workshop">{t("type_workshop")}</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-600">{t("description")}</label>
          <textarea
            {...register("description", { required: t("description") })}
            rows={4}
            className="rounded-xl border border-slate-200 px-3 py-2"
          />
          {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-600">{t("location")}</label>
            <input
              {...register("location", { required: t("location") })}
              className="rounded-xl border border-slate-200 px-3 py-2"
            />
            {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
          </div>
          <div className="flex items-end gap-2">
            <input
              type="checkbox"
              id="is_online"
              {...register("is_online")}
              className="h-5 w-5 rounded border-slate-300"
            />
            <label htmlFor="is_online" className="text-sm font-medium text-slate-600">
              {t("form_online")}
            </label>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-600">{t("start_date")}</label>
            <input
              type="datetime-local"
              {...register("start_date", { required: true })}
              className="rounded-xl border border-slate-200 px-3 py-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-600">{t("end_date")}</label>
            <input
              type="datetime-local"
              {...register("end_date", { required: true })}
              className="rounded-xl border border-slate-200 px-3 py-2"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-slate-600">{t("requirements")}</label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <input
                {...register(`requirements.${index}.value` as const)}
                placeholder={`${t("requirements")} ${index + 1}`}
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2"
              />
              {fields.length > 1 && (
                <button type="button" onClick={() => remove(index)} className="text-sm text-red-500">
                  −
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => append({ value: "" })} className="text-sm font-medium text-accent">
            {t("add_requirement")}
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
        >
          {t("submit")}
        </button>
      </form>
    </div>
  );
}
