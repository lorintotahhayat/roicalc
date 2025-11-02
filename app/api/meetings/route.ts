import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Create Supabase client in API route
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false
    },
    global: {
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          // Add timeout
          signal: AbortSignal.timeout(30000), // 30 second timeout
        }).catch(err => {
          throw err;
        });
      }
    }
  });

  return client;
};

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const apiUrl = `${supabaseUrl}/rest/v1/meetings?select=*&order=date.asc&order=time.asc`;

    let response;
    try {
      // Try native fetch first
      response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      });
    } catch (fetchError: any) {
      
      // Try with https module as fallback (with SSL bypass for dev)
      const https = await import('https');
      const { URL } = await import('url');
      
      return new Promise<NextResponse>((resolve, reject) => {
        const url = new URL(apiUrl);
        
        // Create agent that doesn't reject unauthorized certificates (dev only)
        const agent = new https.Agent({
          rejectUnauthorized: false
        });
        
        const options = {
          hostname: url.hostname,
          port: url.port || 443,
          path: url.pathname + url.search,
          method: 'GET',
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
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            try {
              if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                const meetings = JSON.parse(data);
                resolve(NextResponse.json(Array.isArray(meetings) ? meetings : []));
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

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ 
        error: `HTTP ${response.status}: ${response.statusText}`,
        details: errorText
      }, { status: response.status });
    }

    const meetings = await response.json();

    const result = Array.isArray(meetings) ? meetings : [];
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch meetings',
      type: error.name || 'UnknownError'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ 
        error: 'Missing Supabase environment variables'
      }, { status: 500 });
    }

    const apiUrl = `${supabaseUrl}/rest/v1/meetings`;
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json({ 
          error: `HTTP ${response.status}: ${response.statusText}`,
          details: errorText,
          type: 'HTTP_ERROR'
        }, { status: response.status });
      }

      const data = await response.json();
      // Supabase returns array, get first item
      const newMeeting = Array.isArray(data) && data.length > 0 ? data[0] : data;
      return NextResponse.json(newMeeting, { status: 201 });
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
                const result = JSON.parse(data);
                const newMeeting = Array.isArray(result) && result.length > 0 ? result[0] : result;
                resolve(NextResponse.json(newMeeting, { status: 201 }));
              } else {
                const errorMsg = `HTTP ${res.statusCode}: ${data}`;
                reject(new Error(errorMsg));
              }
            } catch (parseError: any) {
              reject(new Error(`Failed to parse response: ${parseError.message}`));
            }
          });
        });

        req.on('error', (error: any) => {
          reject(new Error(`HTTPS request failed: ${error.message}`));
        });

        req.write(JSON.stringify(body));
        req.end();
      });
    }
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || 'Failed to create meeting',
      type: error.name || 'UnknownError'
    }, { status: 500 });
  }
}

