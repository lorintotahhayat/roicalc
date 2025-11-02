import { supabase } from '@/app/lib/supabase';
import { NextResponse } from 'next/server';

// Import the meetings data structure from page.tsx
const meetings = [
  {
    date: "November 4, 2025",
    day: "Tuesday",
    meetings: [
      {
        company: "Microchip Technology Inc.",
        time: "14:00-14:30",
        status: "confirmed",
        attendees: "Mor, Zohar",
        location: "Microchip Booth 7003",
        contact: {
          name: "Allison Brown",
          email: "allison.brown@microchip.com"
        },
        description: "LOCI platform collaboration discussion - AI-driven observability for ARM 32/64-bit and AURIX TriCore"
      },
      {
        company: "Critical Link LLC",
        time: "14:30-15:00",
        status: "confirmed",
        attendees: "TBD",
        location: "Aurora Booth 9070",
        contact: {
          name: "Amber Thousand",
          linkedin: "https://www.linkedin.com/in/athousand"
        },
        description: "ARM-based SoMs and embedded Linux discussion"
      },
      {
        company: "Giesel Software",
        time: "16:00-16:30",
        status: "confirmed",
        attendees: "TBD",
        location: "TBD",
        contact: {
          name: "Brian Giesel",
          linkedin: "https://www.linkedin.com/in/geisel/"
        },
        description: "Software development consultation"
      },
      {
        company: "Altera",
        time: "16:30-17:00",
        status: "confirmed",
        attendees: "TBD",
        location: "Aurora Booth 9070",
        contact: {
          name: "Shreya Mehrotra",
          linkedin: "https://www.linkedin.com/in/shreyamehrotra/"
        },
        description: "FPGA and embedded systems integration with LOCI",
        isNew: true
      },
      {
        company: "Cadence",
        time: "~16:30",
        status: "tentative",
        attendees: "TBD",
        location: "TBD",
        contact: {
          name: "Vipin Chauhan",
          linkedin: "https://www.linkedin.com/in/vipin-chauhan-84067452/"
        },
        notes: "Unstable meeting - needs confirmation"
      }
    ]
  },
  {
    date: "November 5, 2025",
    day: "Wednesday",
    meetings: [
      {
        company: "Vital Electronics",
        time: "11:00-11:30",
        status: "confirmed",
        attendees: "TBD",
        location: "TBD",
        contact: { name: "TBD" },
        description: "Industrial electronics discussion"
      },
      {
        company: "Ambarella",
        time: "13:00-13:30",
        status: "confirmed",
        attendees: "Mor, Nir, Zohar",
        location: "Aurora Booth 9070",
        contact: {
          name: "Amit Badlani",
          linkedin: "https://www.linkedin.com/in/sfproductguy"
        },
        description: "AI Vision Processors For Edge Applications - extracting valuable data from high-resolution video streams",
        website: "https://www.ambarella.com/"
      },
      {
        company: "Sony",
        time: "13:30-14:00",
        status: "confirmed",
        attendees: "Mor, Nir, Zohar",
        location: "Aurora Booth 9070",
        contact: {
          name: "Hiroki Yamashita",
          email: "hirokia.yamashita@sony.com"
        },
        description: "Demo meeting - referred by Mor Hayat. Hiroki wants to see what Aurora Labs builds"
      },
      {
        company: "Telit Cinterion",
        time: "15:00-15:30",
        status: "confirmed",
        attendees: "Nir",
        location: "Aurora Booth 9070",
        contact: {
          name: "Imad Hourani",
          linkedin: "https://www.linkedin.com/in/imadhourani/"
        },
        description: "IoT modules and connectivity - embedded systems binary security validation"
      },
      {
        company: "HTEC Group",
        time: "16:00-16:30",
        status: "confirmed",
        attendees: "Mor, Nir, Zohar",
        location: "Aurora Booth 9070",
        contact: {
          name: "Stevica Đukić",
          linkedin: "https://www.linkedin.com/in/stevicadjukic/"
        },
        description: "Head of Technology at HTEC Group - Engineering solutions for the future of mobility"
      }
    ]
  },
  {
    date: "November 6, 2025",
    day: "Thursday",
    meetings: [
      {
        company: "AdaCore",
        time: "10:00-10:30",
        status: "confirmed",
        attendees: "Mor, Nir, Zohar",
        location: "Aurora Booth 9070",
        contact: {
          name: "Mark Hermeling",
          linkedin: "https://www.linkedin.com/in/markhermeling/"
        },
        description: "Safety-critical software tools - direct integration opportunity with LOCI"
      },
      {
        company: "IAR",
        time: "11:00-11:30",
        status: "confirmed",
        attendees: "TBD",
        location: "Aurora Booth 9070",
        contact: {
          name: "Simon Ullskog, Thomas Andersson",
          email: "thomas.andersson@iar.com"
        },
        description: "Embedded development tools - direct integration opportunity with LOCI",
        isNew: true
      },
      {
        company: "Microchip Technology Inc.",
        time: "11:30-12:00",
        status: "confirmed",
        attendees: "Nir, Mor, Yaron Raz",
        location: "Aurora Booth 9070",
        contact: {
          name: "Yaron Raz",
          email: "yaron.raz@microchip.com"
        },
        description: "Follow-up meeting with Yaron Raz from Microchip",
        notes: "4 guests total, 3 confirmed (1 in meeting room), 1 awaiting",
        isNew: true
      },
      {
        company: "Wevolver",
        time: "17:00-17:30",
        status: "confirmed",
        attendees: "Nir, 2 guests",
        location: "Aurora Booth 9070",
        contact: {
          name: "A. Cipriano",
          email: "acipriano@supplyframe.com"
        },
        description: "Aurora Labs x Wevolver at Embedded World"
      }
    ]
  }
];

const tbdCompanies = [
  { name: "AWS", contact: "Channa Samynathan" },
  { name: "Bluetooth SIG", contact: "Alfredo Pérez" },
  { name: "Edge AI and Vision Alliance", contact: "Jeff Bier" },
  { name: "IoT M2M Council", contact: "Keith Kreisher" },
  { name: "Meta", contact: "Karthick Kumaran A S V" },
  { name: "Parasoft", contact: "Ricardo Camacho" },
  { name: "Tata Communications", contact: "Swadeep Bijja" },
  { name: "LTIMindtree", contact: "V S Mathur" },
  { name: "OnLogic", contact: "Hunter Golden" },
  { name: "ICS", contact: "Colin Duggan" },
  { name: "SCI Semiconductors", contact: "Haydn Povey" },
  { name: "Universal Electronics", contact: "Pruthvi S" },
  { name: "CommScope", contact: "Xin Qiu, Ph.D." },
  { name: "GitLab", contact: "Darwin Sanoy" },
  { name: "LDRA", contact: "Andrew Banks" },
  { name: "QNX BlackBerry", contact: "Jim Hirsch" },
  { name: "STMicroelectronics", contact: "Miguel Castro" },
  { name: "Green Hills Software", contact: "Greg Davis" }
];

export async function POST() {
  try {
    const results = {
      meetings: { success: 0, errors: [] as string[] },
      tbdCompanies: { success: 0, errors: [] as string[] }
    };

    // Insert meetings
    for (const day of meetings) {
      for (const meeting of day.meetings) {
        const meetingData = {
          company: meeting.company,
          date: day.date,
          day: day.day,
          time: meeting.time,
          status: meeting.status,
          attendees: meeting.attendees || null,
          location: meeting.location || null,
          contact_name: meeting.contact?.name || null,
          contact_email: meeting.contact?.email || null,
          contact_linkedin: meeting.contact?.linkedin || null,
          description: meeting.description || null,
          notes: (meeting as any).notes || null,
          website: (meeting as any).website || null,
          is_new: (meeting as any).isNew || false,
        };

        const { error } = await supabase
          .from('meetings')
          .insert(meetingData);

        if (error) {
          results.meetings.errors.push(`${meeting.company}: ${error.message}`);
        } else {
          results.meetings.success++;
        }
      }
    }

    // Insert TBD companies
    for (const company of tbdCompanies) {
      const { error } = await supabase
        .from('tbd_companies')
        .insert({
          name: company.name,
          contact: company.contact,
        });

      if (error) {
        results.tbdCompanies.errors.push(`${company.name}: ${error.message}`);
      } else {
        results.tbdCompanies.success++;
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: `Inserted ${results.meetings.success} meetings} and ${results.tbdCompanies.success} TBD companies`
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

