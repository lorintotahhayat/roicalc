import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Create Supabase client in API route
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
        }).catch(err => {
          throw err;
        });
      }
    }
  });
};

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const apiUrl = `${supabaseUrl}/rest/v1/tbd_companies?select=*&order=name.asc`;

    let response;
    try {
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
      
      // Try with https module as fallback
      const https = await import('https');
      const { URL } = await import('url');
      
      return new Promise((resolve, reject) => {
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
                const companies = JSON.parse(data);
                resolve(NextResponse.json(Array.isArray(companies) ? companies : []));
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

    const companies = await response.json();

    const result = Array.isArray(companies) ? companies : [];
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch companies',
      type: error.name
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Missing Supabase environment variables' }, { status: 500 });
    }

    const apiUrl = `${supabaseUrl}/rest/v1/tbd_companies`;
    
    
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
          details: errorText
        }, { status: response.status });
      }

      const data = await response.json();
      
      // Return single item if array
      const result = Array.isArray(data) && data.length > 0 ? data[0] : data;
      return NextResponse.json(result, { status: 201 });
      
    } catch (fetchError: any) {
      
      // Fallback to https module
      const https = await import('https');
      const { URL } = await import('url');
      
      return new Promise((resolve, reject) => {
        const url = new URL(apiUrl);
        const agent = new https.Agent({ rejectUnauthorized: false });
        
        const postData = JSON.stringify(body);
        
        const options = {
          hostname: url.hostname,
          port: url.port || 443,
          path: url.pathname,
          method: 'POST',
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
            'Content-Length': Buffer.byteLength(postData)
          },
          agent
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
                const finalResult = Array.isArray(result) && result.length > 0 ? result[0] : result;
                resolve(NextResponse.json(finalResult, { status: 201 }));
              } else {
                const errorMsg = `HTTP ${res.statusCode}: ${data}`;
                reject(new Error(errorMsg));
              }
            } catch (parseError: any) {
              if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                resolve(NextResponse.json({ success: true, message: 'Company created (response parse failed)' }, { status: 201 }));
              } else {
                reject(new Error(`Failed to parse response: ${parseError.message}`));
              }
            }
          });
        });

        req.on('error', (error) => {
          reject(error);
        });

        req.write(postData);
        req.end();
      });
    }
  } catch (error: any) {
    
    return NextResponse.json({ 
      error: error.message || 'Failed to create company',
      type: error.name || 'UnknownError',
      details: error.stack?.split('\n').slice(0, 3).join('\n')
    }, { status: 500 });
  }
}

