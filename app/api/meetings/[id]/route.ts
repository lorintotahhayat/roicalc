import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Create Supabase client in API route
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false
    },
    global: {
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          signal: AbortSignal.timeout(30000), // 30 second timeout
        });
      }
    }
  });
};

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ 
        error: 'Missing Supabase environment variables'
      }, { status: 500 });
    }

    const apiUrl = `${supabaseUrl}/rest/v1/meetings?id=eq.${id}`;
    
    try {
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json({ 
          error: `HTTP ${response.status}: ${response.statusText}`,
          details: errorText
        }, { status: response.status });
      }

      return NextResponse.json({ success: true });
    } catch (fetchError: any) {
      
      const https = await import('https');
      const { URL } = await import('url');
      
      return new Promise((resolve, reject) => {
        const url = new URL(apiUrl);
        const agent = new https.Agent({ rejectUnauthorized: false });
        
        const options = {
          hostname: url.hostname,
          port: url.port || 443,
          path: url.pathname + url.search,
          method: 'DELETE',
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
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              resolve(NextResponse.json({ success: true }));
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${data}`));
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
      error: error.message || 'Failed to delete meeting'
    }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;
    

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      const errorMsg = 'Missing Supabase environment variables';
      return NextResponse.json({ 
        error: errorMsg,
        details: 'NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set'
      }, { status: 500 });
    }

    // Use REST API directly for PUT
    const apiUrl = `${supabaseUrl}/rest/v1/meetings?id=eq.${id}`;
    let response;
    try {
      response = await fetch(apiUrl, {
        method: 'PATCH',
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
      const updatedMeeting = Array.isArray(data) && data.length > 0 ? data[0] : data;
      return NextResponse.json(updatedMeeting);
    } catch (fetchError: any) {
      
      
      // Fallback to https module
      const https = await import('https');
      const { URL } = await import('url');
      
      return new Promise((resolve, reject) => {
        const url = new URL(apiUrl);
        
        const agent = new https.Agent({ rejectUnauthorized: false });
        
        const options = {
          hostname: url.hostname,
          port: url.port || 443,
          path: url.pathname + url.search,
          method: 'PATCH',
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
                const updatedMeeting = Array.isArray(result) && result.length > 0 ? result[0] : result;
                resolve(NextResponse.json(updatedMeeting));
              } else {
                const errorMsg = `HTTP ${res.statusCode}: ${data}`;
                reject(new Error(errorMsg));
              }
            } catch (parseError: any) {
              reject(new Error(`Failed to parse response: ${parseError.message}. Response preview: ${data.substring(0, 200)}`));
            }
          });
        });

        req.on('error', (error: any) => {
          reject(new Error(`HTTPS request failed: ${error.message} (code: ${error.code}, errno: ${error.errno})`));
        });

        req.write(JSON.stringify(body));
        req.end();
      });
    }
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || 'Failed to update meeting',
      type: error.name || 'UnknownError',
      details: error.stack || 'No additional details available'
    }, { status: 500 });
  }
}

