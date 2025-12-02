export type EventType = "hackathon" | "quest" | "tournament" | "seminar" | "meetup" | "lecture" | "workshop" | "other";

export interface Event {
  id: number;
  title: string;
  description: string | null;
  type: EventType;
  city: string | null;
  is_online: boolean;
  date_start: string;
  date_end: string | null;
  organizer_id: number | null;
  banner: string | null;
  requirements: string | null;
  tags: string[] | null;
  source: string | null;
  source_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventFilters {
  query?: string;
  type?: EventType | "all";
  is_online?: boolean | "all";
  sort?: "newest" | "oldest" | "upcoming";
  date_from?: string;
  date_to?: string;
}
