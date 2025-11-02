import { NextResponse } from 'next/server';

// DELETE - Delete a note
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; noteId: string } }
) {
  try {
    const { noteId } = params;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Missing Supabase environment variables' }, { status: 500 });
    }

    const apiUrl = `${supabaseUrl}/rest/v1/meeting_notes?id=eq.${noteId}`;
    
    
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

      // Check if response has content
      const contentType = response.headers.get('content-type');
      let data = null;
      
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        if (text && text.trim()) {
          try {
            data = JSON.parse(text);
          } catch (parseError) {
            // If status is OK but JSON parse failed, still return success
            if (response.status >= 200 && response.status < 300) {
              data = { success: true };
            }
          }
        } else {
          // Empty response but status is OK
          data = { success: true };
        }
      } else {
        const text = await response.text();
        if (text && text.trim()) {
          data = { success: true, message: text };
        } else {
          data = { success: true };
        }
      }

      return NextResponse.json(data || { success: true }, { status: 200 });
      
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
          method: 'DELETE',
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
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
                let result;
                try {
                  result = data && data.trim() ? JSON.parse(data) : { success: true };
                } catch (parseError) {
                  result = { success: true };
                }
                resolve(NextResponse.json(result, { status: 200 }));
              } else {
                const errorMsg = `HTTP ${res.statusCode}: ${data}`;
                reject(new Error(errorMsg));
              }
            } catch (parseError: any) {
              // If status is OK but JSON parse failed, still return success
              if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                resolve(NextResponse.json({ success: true, message: 'Note deleted (response parse failed)' }, { status: 200 }));
              } else {
                reject(new Error(`Failed to parse response: ${parseError.message}`));
              }
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
      error: error.message || 'Failed to delete note',
      type: error.name || 'UnknownError',
      details: error.stack?.split('\n').slice(0, 3).join('\n')
    }, { status: 500 });
  }
}

