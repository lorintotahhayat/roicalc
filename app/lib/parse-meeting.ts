/**
 * Parser to extract meeting information from text
 * Supports both free-form text and structured email formats
 */
export function parseMeetingText(text: string): {
  company?: string;
  date?: string;
  day?: string;
  time?: string;
  location?: string;
  description?: string;
  contact_name?: string;
  contact_email?: string;
  attendees?: string;
  status: 'confirmed' | 'tentative' | 'tbd';
} {
  const result: any = {
    status: 'confirmed' as const,
  };

  // Parse structured email format
  // Event Type
  const eventTypeMatch = text.match(/Event Type:\s*(.+?)(?:\n|Invitee:|$)/i);
  if (eventTypeMatch) {
    const eventType = eventTypeMatch[1].trim();
    // Extract company name from event type
    const companyMatch = eventType.match(/(?:Meeting|Event|at)\s+([A-Z][A-Za-z\s&.,]+?)(?:\s+at|\s+in|$)/i);
    if (companyMatch) {
      result.company = companyMatch[1].trim();
    } else {
      result.company = eventType;
    }
    result.description = eventType;
  }

  // Invitee
  const inviteeMatch = text.match(/Invitee:\s*(.+?)(?:\n|Invitee Email:|$)/i);
  if (inviteeMatch) {
    result.contact_name = inviteeMatch[1].trim();
  }

  // Invitee Email
  const emailMatch = text.match(/Invitee Email:\s*(.+?)(?:\n|Event Date|Location:|$)/i);
  if (emailMatch) {
    result.contact_email = emailMatch[1].trim();
  }

  // Event Date/Time
  const dateTimeMatch = text.match(/Event Date\/Time:\s*(.+?)(?:\n|Location:|$)/i);
  if (dateTimeMatch) {
    const dateTimeStr = dateTimeMatch[1].trim();
    
    // Extract time (e.g., "17:30")
    const timeMatch = dateTimeStr.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      result.time = `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}`;
    }
    
    // Extract date (e.g., "Tuesday, 4 November 2025")
    const dateMatch = dateTimeStr.match(/(\w+day),\s*(\d{1,2})\s+(\w+)\s+(\d{4})/i);
    if (dateMatch) {
      const dayName = dateMatch[1];
      const day = parseInt(dateMatch[2], 10);
      const monthName = dateMatch[3];
      const year = parseInt(dateMatch[4], 10);
      
      const months: Record<string, number> = {
        'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
        'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
      };
      
      const month = months[monthName.toLowerCase()];
      if (month !== undefined) {
        const date = new Date(year, month, day);
        result.date = formatDate(date);
        result.day = dayName;
      }
    }
  }

  // Location
  const locationMatch = text.match(/Location:\s*(.+?)(?:\n|$)/i);
  if (locationMatch) {
    result.location = locationMatch[1].trim();
  }

  // If not in structured format, try free-form parsing
  if (!result.company) {
    // Extract company name (usually after "with", "meeting with", "at", etc.)
    const companyMatch = text.match(/(?:with|at|meeting with)\s+([A-Z][A-Za-z\s&.,]+?)(?:\s+(?:tomorrow|today|on|at|booth|in|by))?/i);
    if (companyMatch) {
      result.company = companyMatch[1].trim();
    }
  }

  // Extract time (various formats: 10:00, 10:00 AM, 10-11, etc.) - only if not already parsed
  if (!result.time) {
    const timeMatch = text.match(/(\d{1,2}[:-]\d{2}(?:\s*[AP]M)?|\d{1,2}\s*[AP]M)/i);
    if (timeMatch) {
      let time = timeMatch[1];
      // Normalize time format
      if (time.includes('AM') || time.includes('PM')) {
        const [hour, rest] = time.split(':');
        const ampm = rest?.match(/[AP]M/i)?.[0] || time.match(/[AP]M/i)?.[0];
        if (hour && ampm) {
          const hourNum = parseInt(hour);
          const min = rest?.replace(/[AP]M/i, '') || '00';
          const hour24 = ampm.toUpperCase() === 'PM' && hourNum !== 12 ? hourNum + 12 : hourNum === 12 && ampm.toUpperCase() === 'AM' ? 0 : hourNum;
          result.time = `${hour24.toString().padStart(2, '0')}:${min.padStart(2, '0')}`;
        }
      } else {
        result.time = time.replace('-', ':');
      }
    }
  }

  // Extract date keywords
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (text.match(/tomorrow/i)) {
    result.date = formatDate(tomorrow);
    result.day = getDayName(tomorrow);
  } else if (text.match(/today/i)) {
    result.date = formatDate(today);
    result.day = getDayName(today);
  }

  // Extract location/booth - only if not already parsed
  if (!result.location) {
    const locationMatch = text.match(/(?:at|booth|location)\s+([A-Z0-9\s]+?)(?:\.|,|$)/i);
    if (locationMatch) {
      result.location = locationMatch[1].trim();
    }
  }

  // Extract description (everything else)
  const description = text
    .replace(/(?:meeting|with|at|booth|tomorrow|today)\s+/gi, '')
    .replace(/^\d{1,2}[:-]\d{2}/, '')
    .trim();
  if (description && description !== result.company) {
    result.description = description;
  }

  // Detect tentative status
  if (text.match(/(?:tentative|maybe|possibly|might|tbd|to be determined)/i)) {
    result.status = 'tentative';
  }

  // If no company found, use first capitalized words as company
  if (!result.company) {
    const words = text.split(/\s+/);
    const capitalizedWords = words.filter(w => /^[A-Z]/.test(w)).slice(0, 3);
    if (capitalizedWords.length > 0) {
      result.company = capitalizedWords.join(' ');
    }
  }

  return result;
}

function formatDate(date: Date): string {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function getDayName(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

