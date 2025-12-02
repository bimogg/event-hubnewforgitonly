import axios from "axios";
import type { Event, EventFilters } from "../types/event.types";
import type { InternshipSlot } from "../types/slot.types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
});

export interface PaginatedEventsResponse {
  items: Event[];
  total: number;
}

export interface PaginatedSlotsResponse {
  items: InternshipSlot[];
  total: number;
}

export async function getEvents(params?: EventFilters): Promise<PaginatedEventsResponse> {
  try {
    const apiUrl = api.defaults.baseURL + '/events/';
    console.log('🔍 getEvents: Fetching from', apiUrl, params);
    
    const response = await api.get<Event[]>("/events/", { params, timeout: 10000 });
    
    // КРИТИЧЕСКАЯ ДИАГНОСТИКА
    console.log('📥 getEvents: Response status:', response.status);
    console.log('📥 getEvents: Response headers:', response.headers);
    console.log('📥 getEvents: Response data type:', Array.isArray(response.data) ? 'array' : typeof response.data);
    console.log('📥 getEvents: Response data:', response.data);
    console.log('📥 getEvents: Response data length:', Array.isArray(response.data) ? response.data.length : 'N/A');
    
    const items = Array.isArray(response.data) ? response.data : [];
    
    if (items.length > 0) {
      console.log('✅ getEvents: SUCCESS! Received', items.length, 'events');
      console.log('📅 First event:', items[0]);
      console.log('📅 All events IDs:', items.map(e => e.id));
    } else {
      console.error('❌ getEvents: CRITICAL ERROR - Received empty array from API!');
      console.error('❌ API should ALWAYS return fallback events!');
      console.error('❌ Response:', JSON.stringify(response.data, null, 2));
    }
    
    return { items, total: items.length };
  } catch (error: any) {
    // КРИТИЧЕСКАЯ ОШИБКА - API должен ВСЕГДА возвращать события
    console.error("❌ getEvents: CRITICAL ERROR fetching events:", error);
    console.error("❌ getEvents: Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    });
    // Даже при ошибке возвращаем пустой массив - но это НЕ должно происходить
    return { items: [], total: 0 };
  }
}

export async function getSlots(params?: { status?: string; city?: string }): Promise<PaginatedSlotsResponse> {
  try {
    const response = await api.get<InternshipSlot[]>("/internship/slots", { params });
    const items = Array.isArray(response.data) ? response.data : [];
    return { items, total: items.length };
  } catch (error) {
    console.error("Error fetching slots:", error);
    throw error;
  }
}

export async function createEvent(data: Partial<Event>): Promise<Event> {
  const response = await api.post<Event>("/events/", data);
  return response.data;
}

export async function getEvent(id: number): Promise<Event> {
  const response = await api.get<Event>(`/events/${id}`);
  return response.data;
}

export async function updateEvent(id: number, data: Partial<Event>): Promise<Event> {
  const response = await api.patch<Event>(`/events/${id}` , data);
  return response.data;
}

// СРОЧНЫЙ запуск парсинга (для дедлайна)
export async function scrapeEventsNow(): Promise<{ success: boolean; message: string; results: Record<string, number>; total: number }> {
  try {
    console.log('🚀 scrapeEventsNow: Starting urgent scraping...');
    const response = await api.post<{ success: boolean; message: string; results: Record<string, number>; total: number }>("/events/scrape-now", {}, { timeout: 60000 });
    console.log('✅ scrapeEventsNow: Scraping completed!', response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ scrapeEventsNow: Error:", error);
    return {
      success: false,
      message: error.message || "Ошибка при парсинге",
      results: {},
      total: 0
    };
  }
}
