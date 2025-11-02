import { NextResponse } from 'next/server';

// GET - Fetch notes for a meeting
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Missing Supabase environment variables' }, { status: 500 });
    }

    const apiUrl = `${supabaseUrl}/rest/v1/meeting_notes?meeting_id=eq.${id}&order=created_at.desc`;
    
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json({ 
          error: `HTTP ${response.status}: ${response.statusText}`,
          details: errorText
        }, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json(Array.isArray(data) ? data : []);
    } catch (fetchError: any) {
      // Fallback to https module
      const https = await import('https');
      const { URL } = await import('url');
      
      return new Promise<NextResponse>((resolve, reject) => {
        const url = new URL(apiUrl);
        const agent = new https.Agent({ rejectUnauthorized: false });
        
        const options = {
          hostname: url.hostname,
          port: url.port || 443,
          path: url.pathname + url.search,
          method: 'GET',
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json'
          },
          agent: agent
        };

        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            try {
              if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                const result = JSON.parse(data);
                resolve(NextResponse.json(Array.isArray(result) ? result : []));
              } else {
                reject(new Error(`HTTP ${res.statusCode}: ${data}`));
              }
            } catch (parseError) {
              reject(parseError);
            }
          });
        });

        req.on('error', (error) => {
          reject(error);
        });

        req.end();
      });
    }
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch notes'
    }, { status: 500 });
  }
}

// POST - Add a new note
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { note_text, created_by } = body;

    if (!note_text || !created_by) {
      return NextResponse.json({ 
        error: 'note_text and created_by are required'
      }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Missing Supabase environment variables' }, { status: 500 });
    }

    const apiUrl = `${supabaseUrl}/rest/v1/meeting_notes`;
    const noteData = {
      meeting_id: id,
      note_text,
      created_by
    };
    
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(noteData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        // Check if table doesn't exist
        if (errorText.includes('does not exist') || errorText.includes('relation') || errorText.includes('42P01')) {
          return NextResponse.json({ 
            error: 'meeting_notes table does not exist',
            message: 'Please create the table first by running the SQL in supabase-meeting-notes.sql',
            details: errorText,
            type: 'MISSING_TABLE'
          }, { status: 500 });
        }
        
        return NextResponse.json({ 
          error: `HTTP ${response.status}: ${response.statusText}`,
          details: errorText
        }, { status: response.status });
      }

      // Check if response has content
      const contentType = response.headers.get('content-type');
      let data = null;
      
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        if (text.trim()) {
          try {
            data = JSON.parse(text);
            const newNote = Array.isArray(data) && data.length > 0 ? data[0] : data;
            return NextResponse.json(newNote, { status: 201 });
          } catch (parseError) {
            // Return success even if we can't parse the response
            return NextResponse.json({ success: true, message: 'Note created' }, { status: 201 });
          }
        } else {
          return NextResponse.json({ success: true, message: 'Note created' }, { status: 201 });
        }
      } else {
        // No JSON content type, but status is OK
        return NextResponse.json({ success: true, message: 'Note created' }, { status: 201 });
      }
    } catch (fetchError: any) {
      
      
      // Fallback to https module
      const https = await import('https');
      const { URL } = await import('url');
      
      return new Promise<NextResponse>((resolve, reject) => {
        const url = new URL(apiUrl);
        const agent = new https.Agent({ rejectUnauthorized: false });
        
        const options = {
          hostname: url.hostname,
          port: url.port || 443,
          path: url.pathname,
          method: 'POST',
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          agent: agent
        };

        const req = https.request(options, (res) => {
          
          let data = '';
          res.on('data', (chunk) => { 
            data += chunk;
          });
          res.on('end', () => {
            try {
              if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                // Handle empty response
                if (!data || data.trim() === '') {
                  // Return a simple success response
                  resolve(NextResponse.json({ success: true, message: 'Note created' }, { status: 201 }));
                  return;
                }
                
                const result = JSON.parse(data);
                const newNote = Array.isArray(result) && result.length > 0 ? result[0] : result;
                resolve(NextResponse.json(newNote, { status: 201 }));
              } else {
                const errorMsg = `HTTP ${res.statusCode}: ${data}`;
                
                // Check if table doesn't exist
                if (data.includes('does not exist') || data.includes('relation') || data.includes('42P01')) {
                  reject(new Error('MISSING_TABLE: meeting_notes table does not exist. Please run supabase-meeting-notes.sql'));
                } else {
                  reject(new Error(errorMsg));
                }
              }
            } catch (parseError: any) {
              // If status is OK but JSON parse failed, still return success
              if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                resolve(NextResponse.json({ success: true, message: 'Note created (response parse failed)' }, { status: 201 }));
              } else {
                reject(new Error(`Failed to parse response: ${parseError.message}`));
              }
            }
          });
        });

        req.on('error', (error: any) => {
          reject(new Error(`HTTPS request failed: ${error.message}`));
        });

        req.write(JSON.stringify(noteData));
        req.end();
      });
    }
  } catch (error: any) {
    
    // Check if error is about missing table
    if (error.message && (error.message.includes('relation') || error.message.includes('does not exist') || error.message.includes('meeting_notes') || error.message.includes('MISSING_TABLE') || error.message.includes('42P01'))) {
      return NextResponse.json({ 
        error: 'meeting_notes table does not exist',
        message: 'To fix this: Go to Supabase Dashboard → SQL Editor → Copy and run the SQL from supabase-meeting-notes.sql file',
        details: error.message,
        type: 'MISSING_TABLE',
        sqlFile: 'supabase-meeting-notes.sql'
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: error.message || 'Failed to add note',
      type: error.name || 'UnknownError',
      details: error.stack?.split('\n').slice(0, 3).join('\n')
    }, { status: 500 });
  }
}

