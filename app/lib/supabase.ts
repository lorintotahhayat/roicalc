import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Meeting {
  id?: string;
  company: string;
  date: string;
  day?: string;
  time: string;
  status: 'confirmed' | 'tentative' | 'tbd';
  attendees?: string;
  location?: string;
  contact_name?: string;
  contact_email?: string;
  contact_linkedin?: string;
  description?: string;
  notes?: string;
  website?: string;
  is_new?: boolean;
  created_at?: string;
}

export interface TBDCompany {
  id?: string;
  name: string;
  contact: string;
  created_at?: string;
}

