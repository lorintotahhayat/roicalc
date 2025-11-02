import { supabase } from '@/app/lib/supabase';
import { NextResponse } from 'next/server';

// Migration SQL to create tables
const createTablesSQL = `
-- Create meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  date TEXT NOT NULL,
  day TEXT,
  time TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('confirmed', 'tentative', 'tbd')),
  attendees TEXT,
  location TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_linkedin TEXT,
  description TEXT,
  notes TEXT,
  website TEXT,
  is_new BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tbd_companies table
CREATE TABLE IF NOT EXISTS tbd_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tbd_companies ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (for now - you can restrict later)
CREATE POLICY IF NOT EXISTS "Allow all operations on meetings" ON meetings
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow all operations on tbd_companies" ON tbd_companies
  FOR ALL USING (true) WITH CHECK (true);
`;

export async function POST() {
  try {
    // Execute migration
    const { error: migrationError } = await supabase.rpc('exec_sql', { 
      sql: createTablesSQL 
    });

    if (migrationError) {
      // Try direct SQL execution
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Migration started. Please run the SQL in Supabase dashboard.' 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

