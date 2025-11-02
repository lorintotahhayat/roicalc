import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'app', 'event', 'floorplan.pdf');
    const fileBuffer = await readFile(filePath);
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="floorplan.pdf"',
      },
    });
  } catch (error) {
    return new NextResponse('PDF not found', { status: 404 });
  }
}

