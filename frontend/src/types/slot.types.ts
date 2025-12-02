export interface InternshipSlot {
  id: number;
  title: string;
  description: string;
  operation?: string;
  required_skills?: string[];
  slot_start: string;
  slot_end: string;
  duration_hours: number;
  address: string;
  city?: string;
  payment?: number;
  bonus?: string;
  status: string;
  type?: string; // для фильтрации
  company_id: number;
  created_at: string;
  updated_at: string;
}

