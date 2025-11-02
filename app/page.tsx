"use client";

import React, { useState, useMemo, useEffect } from "react";
import "./event/event.css";
import { parseMeetingText } from "@/app/lib/parse-meeting";

// Companies directory - kept for Directory tab
const companies = [
  { name: "AAEON Electronics, Inc.", booth: "7066", useCase: "Industrial computing platforms - may use third-party binaries requiring validation", type: "Module/COM/Board Vendor" },
  { name: "ADL Embedded Solutions", booth: "8044", useCase: "Embedded computing solutions - potential for binary optimization in customer projects", type: "Consulting/Services/Embedded Houses" },
  { name: "Advanced Security Technologies", booth: "4009D", useCase: "Security focus aligns with LOCI's binary security validation capabilities", type: "Embedded/Industrial Vendor" },
  { name: "Advantech Corporation", booth: "6048", useCase: "Industrial IoT platforms - third-party software integration requires binary validation", type: "Module/COM/Board Vendor" },
  { name: "Altium", booth: "6003", useCase: "PCB design tools - may integrate with embedded development workflows", type: "Design/EDA/IP/ASIC" },
  { name: "American Portwell Technology, Inc.", booth: "3060", useCase: "Embedded computing platforms - customers may need binary validation services", type: "Embedded/Industrial Vendor" },
  { name: "APLEX Technology Inc.", booth: "9060", useCase: "Industrial computing - embedded systems requiring binary performance analysis", type: "Embedded/Industrial Vendor" },
  { name: "ASRock Industrial Computer Corporation", booth: "3079", useCase: "Industrial computing - embedded systems may require binary validation", type: "Module/COM/Board Vendor" },
  { name: "Avalue Technology Inc.", booth: "6049", useCase: "Embedded computing platforms - customers need binary analysis for third-party code", type: "Module/COM/Board Vendor" },
  { name: "Axiomtek", booth: "4055", useCase: "Industrial computing - embedded platforms may require binary optimization", type: "Module/COM/Board Vendor" },
  { name: "Beacon EmbeddedWorks", booth: "6071", useCase: "Embedded systems design services - direct need for binary analysis in customer projects", type: "Consulting/Services/Embedded Houses" },
  { name: "Ceva, Inc", booth: "8065", useCase: "DSP/AI IP provider - binary optimization essential for edge AI implementations", type: "Design/EDA/IP/ASIC" },
  { name: "ChipFoundry", booth: "7088", useCase: "Semiconductor services - chip development may require binary analysis", type: "Design/EDA/IP/ASIC" },
  { name: "congatec", booth: "3039", useCase: "ARM-based computer modules - direct platform alignment with LOCI's ARM support", type: "Module/COM/Board Vendor" },
  { name: "Connect Tech Inc", booth: "7038", useCase: "Embedded computing solutions - customers may need binary validation", type: "Module/COM/Board Vendor" },
  { name: "Contec Americas, Inc", booth: "6039", useCase: "Industrial computing - embedded control systems may require binary analysis", type: "Module/COM/Board Vendor" },
  { name: "Crank Software- AMETEK", booth: "6085", useCase: "HMI software - embedded GUI systems may benefit from performance optimization", type: "RTOS/Toolchain/Debug" },
  { name: "Critical Link LLC", booth: "3065", useCase: "ARM-based SoMs and embedded Linux - direct alignment with LOCI platform support", type: "Consulting/Services/Embedded Houses" },
  { name: "Custom Silicon Solutions, Inc.", booth: "6042", useCase: "Custom silicon - may involve embedded software requiring binary analysis", type: "Design/EDA/IP/ASIC" },
  { name: "Diamond Systems Corp", booth: "5042", useCase: "Embedded computing boards - customers may need binary performance validation", type: "Embedded/Industrial Vendor" },
  { name: "DiSTI Corporation", booth: "2061", useCase: "Simulation software - may involve embedded system simulation", type: "RTOS/Toolchain/Debug" },
  { name: "Dojo Five", booth: "9017", useCase: "Rust/embedded consulting - direct alignment with LOCI's C/C++/Rust support", type: "Consulting/Services/Embedded Houses" },
  { name: "DPTechnics b.v", booth: "6047", useCase: "IoT/embedded solutions - may require binary validation for security", type: "Embedded/Industrial Vendor" },
  { name: "EdgeImpulse / Foundries.io", booth: "5061", useCase: "Edge AI platform and secure embedded Linux - direct LOCI use case alignment", type: "Consulting/Services/Embedded Houses" },
  { name: "Efabless", booth: "6065", useCase: "Open-source chip design - may involve embedded software requiring analysis", type: "Design/EDA/IP/ASIC" },
  { name: "Ellisys", booth: "2046", useCase: "Protocol analyzers - embedded networking tools may complement binary analysis", type: "RTOS/Toolchain/Debug" },
  { name: "eLogicTech Solutions Inc (dba. eLT Edge)", booth: "9059", useCase: "Edge computing solutions - embedded systems may require binary optimization", type: "Consulting/Services/Embedded Houses" },
  { name: "Embedd", booth: "8030", useCase: "Embedded solutions - direct relevance to embedded systems development", type: "Consulting/Services/Embedded Houses" },
  { name: "Embedded Design Engineering", booth: "9022", useCase: "Embedded design services - may work with systems requiring binary analysis", type: "Consulting/Services/Embedded Houses" },
  { name: "embeddedTS", booth: "2081", useCase: "ARM-based embedded computers - direct platform alignment with LOCI", type: "Consulting/Services/Embedded Houses" },
  { name: "Emproof", booth: "7076", useCase: "Embedded security testing - complementary to LOCI's binary security analysis", type: "Security/Vulnerability" },
  { name: "EnSilica", booth: "2087", useCase: "Mixed-signal ASICs - custom silicon may involve embedded software", type: "Design/EDA/IP/ASIC" },
  { name: "Finite State", booth: "6021f", useCase: "Firmware security analysis - direct complementary solution to LOCI binary analysis", type: "Security/Vulnerability" },
  { name: "Giesecke+Devrient (G+D)", booth: "6021i", useCase: "Security solutions for IoT - binary security validation aligns with LOCI capabilities", type: "Security/Vulnerability" },
  { name: "GigaDevice Semiconductor, Inc", booth: "8085", useCase: "MCU manufacturer - ARM Cortex-M products align with LOCI platform support", type: "Semiconductor/MCU/SoC" },
  { name: "GitLab, Inc.", booth: "3070", useCase: "DevOps platform - embedded CI/CD may integrate with binary analysis", type: "RTOS/Toolchain/Debug" },
  { name: "GOWIN Semiconductor", booth: "8061", useCase: "FPGA manufacturer - embedded systems on FPGA may benefit from analysis", type: "Semiconductor/MCU/SoC" },
  { name: "Green Hills Software LLC", booth: "2021", useCase: "RTOS and safety-critical tools - direct competitor but potential integration partner", type: "RTOS/Toolchain/Debug" },
  { name: "Grinn", booth: "7065", useCase: "Embedded Linux solutions - ARM-based systems align with LOCI platform", type: "Consulting/Services/Embedded Houses" },
  { name: "IAR", booth: "8013", useCase: "Embedded development tools - direct integration opportunity with LOCI", type: "RTOS/Toolchain/Debug" },
  { name: "IBASE Technology Inc.", booth: "7039", useCase: "Industrial computing - embedded systems may require binary validation", type: "Module/COM/Board Vendor" },
  { name: "ICOP Technology Inc.", booth: "4028", useCase: "Industrial computing boards - embedded systems may need binary analysis", type: "Module/COM/Board Vendor" },
  { name: "Industrial PC Inc", booth: "9032", useCase: "Industrial computing - embedded systems may require binary optimization", type: "Module/COM/Board Vendor" },
  { name: "Infineon Technologies", booth: "4064", useCase: "Automotive/security semiconductors - direct LOCI target vertical alignment", type: "Semiconductor/MCU/SoC" },
  { name: "Intrepid Control Systems, Inc.", booth: "9003", useCase: "Automotive testing tools - embedded automotive systems align with LOCI", type: "Embedded/Industrial Vendor" },
  { name: "ITK Engineering", booth: "7051", useCase: "Automotive software development - safety-critical systems need binary validation", type: "Consulting/Services/Embedded Houses" },
  { name: "Joulescope", booth: "4072", useCase: "Power measurement tools - embedded systems power analysis complements LOCI", type: "Embedded/Industrial Vendor" },
  { name: "KDAB", booth: "5039", useCase: "Qt/embedded software consulting - embedded applications may need optimization", type: "RTOS/Toolchain/Debug" },
  { name: "Keysight Technologies, Inc", booth: "4054", useCase: "Test equipment - embedded system testing may complement binary analysis", type: "RTOS/Toolchain/Debug" },
  { name: "Kontron America, Inc", booth: "6077", useCase: "Embedded computing platforms - customers may need binary validation", type: "Module/COM/Board Vendor" },
  { name: "KORE", booth: "6021c", useCase: "IoT connectivity - embedded systems may require binary security validation", type: "Connectivity/IoT Modules" },
  { name: "Kudelski Labs", booth: "4086", useCase: "Security research and IoT security - direct alignment with LOCI security use cases", type: "Security/Vulnerability" },
  { name: "Lanner Electronics Inc", booth: "9014", useCase: "Network appliances - embedded networking systems may need binary analysis", type: "Module/COM/Board Vendor" },
  { name: "Lauterbach", booth: "4020", useCase: "Embedded debugging tools - complementary to LOCI binary analysis capabilities", type: "RTOS/Toolchain/Debug" },
  { name: "LDRA Technology, INC", booth: "2058", useCase: "Safety-critical software tools - direct integration opportunity with LOCI", type: "RTOS/Toolchain/Debug" },
  { name: "LM Technologies Ltd", booth: "3054", useCase: "Bluetooth modules - embedded wireless systems may require binary optimization", type: "Embedded/Industrial Vendor" },
  { name: "Logic Fruit Global Technologies", booth: "4048", useCase: "FPGA/embedded solutions - may involve systems requiring binary analysis", type: "Consulting/Services/Embedded Houses" },
  { name: "Megachips LSI America Corporation", booth: "6030", useCase: "ASIC/system solutions - custom silicon may involve embedded software", type: "Semiconductor/MCU/SoC" },
  { name: "Microchip Technology Inc.", booth: "7003", useCase: "MCU/MPU manufacturer - ARM Cortex and PIC platforms align with LOCI", type: "Semiconductor/MCU/SoC" },
  { name: "MIPS", booth: "2009", useCase: "Processor architecture - embedded MIPS systems may benefit from binary analysis", type: "Semiconductor/MCU/SoC" },
  { name: "MosChip®", booth: "4068", useCase: "Semiconductor solutions - embedded systems may require binary optimization", type: "Semiconductor/MCU/SoC" },
  { name: "MultiTech", booth: "6021j", useCase: "IoT communication devices - embedded systems need binary security validation", type: "Connectivity/IoT Modules" },
  { name: "Nanopower Semiconductor AS", booth: "4087", useCase: "Ultra-low power semiconductors - power optimization aligns with LOCI capabilities", type: "Semiconductor/MCU/SoC" },
  { name: "NEXCOM International", booth: "6015, 9016", useCase: "Industrial computing - embedded systems may require binary validation", type: "Module/COM/Board Vendor" },
  { name: "Octavo Systems", booth: "8021", useCase: "ARM-based system-in-package - embedded systems may benefit from binary analysis", type: "Design/EDA/IP/ASIC" },
  { name: "OnLogic", booth: "9024", useCase: "Edge computing hardware - embedded systems may need binary performance analysis", type: "Module/COM/Board Vendor" },
  { name: "Opal Kelly Inc.", booth: "9056", useCase: "FPGA integration products - embedded FPGA systems may benefit from analysis", type: "Design/EDA/IP/ASIC" },
  { name: "Parasoft", booth: "8031", useCase: "Software testing and safety tools - direct integration opportunity with LOCI", type: "RTOS/Toolchain/Debug" },
  { name: "PEmicro", booth: "8072", useCase: "Embedded development tools - debugging tools complement binary analysis", type: "RTOS/Toolchain/Debug" },
  { name: "Peridio", booth: "4044", useCase: "IoT device management and OTA - binary validation and security aligns with LOCI", type: "Design/EDA/IP/ASIC" },
  { name: "Pico Technology", booth: "5060", useCase: "Test equipment - embedded system testing may complement binary analysis", type: "Connectivity/IoT Modules" },
  { name: "PLS Development Tools", booth: "2043", useCase: "Embedded debugging tools - complementary to LOCI binary analysis", type: "RTOS/Toolchain/Debug" },
  { name: "Polywell Computers, Inc.", booth: "6066", useCase: "Industrial computing - embedded systems may require binary validation", type: "Embedded/Industrial Vendor" },
  { name: "PQSecure", booth: "5086", useCase: "Post-quantum cryptography - binary validation for PQ crypto implementations", type: "Security/Vulnerability" },
  { name: "PQShield", booth: "2078", useCase: "Post-quantum cryptography - LOCI can validate PQ crypto binary implementations", type: "Security/Vulnerability" },
  { name: "Premio Inc", booth: "5021", useCase: "Industrial computing - embedded systems may require binary analysis", type: "Module/COM/Board Vendor" },
  { name: "QNX", booth: "7045", useCase: "Real-time OS for automotive/industrial - direct LOCI use case for binary analysis", type: "RTOS/Toolchain/Debug" },
  { name: "Qt Group", booth: "5024", useCase: "Cross-platform application framework - embedded Qt applications may need optimization", type: "RTOS/Toolchain/Debug" },
  { name: "Quantropi", booth: "2068", useCase: "Quantum-safe security - binary validation for quantum-safe crypto implementations", type: "Security/Vulnerability" },
  { name: "Quectel Wireless Solutions Co., Ltd.", booth: "3011", useCase: "IoT modules - embedded wireless systems may require binary optimization", type: "Connectivity/IoT Modules" },
  { name: "Raytac Group", booth: "5067", useCase: "Wireless modules - embedded systems may require binary optimization", type: "Connectivity/IoT Modules" },
  { name: "Red Balloon Security", booth: "2020", useCase: "Firmware security analysis - direct complementary solution to LOCI", type: "Security/Vulnerability" },
  { name: "Renesas", booth: "5035", useCase: "Automotive/industrial MCUs - direct platform alignment and target vertical", type: "Semiconductor/MCU/SoC" },
  { name: "Rohde & Schwarz USA, Inc.", booth: "6046", useCase: "Test equipment - embedded system testing may complement binary analysis", type: "RTOS/Toolchain/Debug" },
  { name: "RunSafe Security", booth: "7084", useCase: "Embedded security and binary hardening - direct complementary solution to LOCI", type: "Security/Vulnerability" },
  { name: "Savoir Faire Linux", booth: "8066", useCase: "Embedded Linux consulting - ARM-based systems align with LOCI", type: "Consulting/Services/Embedded Houses" },
  { name: "SciTools", booth: "7080", useCase: "Static analysis tools - complementary to LOCI binary analysis", type: "RTOS/Toolchain/Debug" },
  { name: "Sealevel Systems, Inc.", booth: "4061", useCase: "Industrial I/O and computing - embedded systems may need binary analysis", type: "Embedded/Industrial Vendor" },
  { name: "SECO", booth: "7011", useCase: "Edge AI computing platforms - direct alignment with LOCI's edge AI use cases", type: "Module/COM/Board Vendor" },
  { name: "Secure-IC", booth: "5088", useCase: "Hardware security and chiplet security - LOCI can validate secure implementations", type: "Security/Vulnerability" },
  { name: "SEGGER", booth: "5047", useCase: "Embedded tools and RTOS - direct integration opportunity with LOCI", type: "RTOS/Toolchain/Debug" },
  { name: "Softeq", booth: "6043", useCase: "Custom software development - may work with embedded systems requiring analysis", type: "Consulting/Services/Embedded Houses" },
  { name: "STMicroelectronics, Inc", booth: "4015", useCase: "MCU manufacturer (ARM Cortex-M) - direct platform alignment with LOCI", type: "Semiconductor/MCU/SoC" },
  { name: "TechNexion Ltd.", booth: "4021", useCase: "ARM-based computing modules - embedded systems may benefit from binary analysis", type: "Module/COM/Board Vendor" },
  { name: "Telit Cinterion", booth: "7021", useCase: "IoT modules and connectivity - embedded systems may need binary security validation", type: "Connectivity/IoT Modules" },
  { name: "TORADEX", booth: "2015", useCase: "ARM-based computer modules with Linux - direct platform alignment with LOCI", type: "Module/COM/Board Vendor" },
  { name: "Total Phase", booth: "6026", useCase: "Embedded development tools - debugging and analysis tools complement LOCI", type: "RTOS/Toolchain/Debug" },
  { name: "TQ Systems USA Inc.", booth: "3038", useCase: "ARM-based embedded modules - systems may benefit from binary analysis", type: "Module/COM/Board Vendor" },
  { name: "Trident IoT LLC", booth: "9015", useCase: "IoT solutions - embedded systems may require binary security validation", type: "Connectivity/IoT Modules" },
  { name: "TrustInSoft", booth: "9040", useCase: "Static analysis and formal verification - complementary to LOCI binary analysis", type: "RTOS/Toolchain/Debug" },
  { name: "Tuxera", booth: "6076", useCase: "File system software - embedded storage systems may benefit from optimization", type: "RTOS/Toolchain/Debug" },
  { name: "Unigraf", booth: "2046A", useCase: "Display test equipment - embedded display systems may need analysis", type: "RTOS/Toolchain/Debug" },
  { name: "Vector Electronics & Technology, Inc.", booth: "5073", useCase: "Automotive testing and development tools - AUTOSAR systems need binary validation", type: "Embedded/Industrial Vendor" },
  { name: "VeriSilicon Inc.", booth: "6055", useCase: "Silicon IP and platforms - custom silicon may involve embedded software", type: "Semiconductor/MCU/SoC" },
  { name: "Verizon Business", booth: "9080", useCase: "IoT connectivity - embedded systems in IoT devices may need validation", type: "Connectivity/IoT Modules" },
  { name: "VersaLogic, Corp", booth: "6061", useCase: "Industrial computing - embedded systems may require binary analysis", type: "Module/COM/Board Vendor" },
  { name: "Visure Solutions", booth: "4089", useCase: "Requirements management - safety-critical development may integrate with LOCI", type: "RTOS/Toolchain/Debug" },
  { name: "Vodafone IoT", booth: "6021g", useCase: "IoT connectivity platform - embedded systems may need binary security validation", type: "Connectivity/IoT Modules" }
];


const getBadgeClass = (type: string) => {
  const badgeMap: Record<string, string> = {
    "Module/COM/Board Vendor": "badge-module",
    "Consulting/Services/Embedded Houses": "badge-consulting",
    "Semiconductor/MCU/SoC": "badge-semiconductor",
    "RTOS/Toolchain/Debug": "badge-rtos",
    "Security/Vulnerability": "badge-security",
    "Design/EDA/IP/ASIC": "badge-design",
    "Embedded/Industrial Vendor": "badge-industrial",
    "Connectivity/IoT Modules": "badge-connectivity"
  };
  return badgeMap[type] || "bg-gray-500";
};

interface DBMeeting {
  id: string;
  company: string;
  date: string;
  day: string | null;
  time: string;
  status: 'confirmed' | 'tentative' | 'tbd';
  attendees: string | null;
  location: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_linkedin: string | null;
  description: string | null;
  notes: string | null;
  website: string | null;
  is_new: boolean;
}

interface DBTBDCompany {
  id: string;
  name: string;
  contact: string;
}

export default function EventPage() {
  const [activePage, setActivePage] = useState<"schedule" | "directory" | "floorplan">("schedule");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [dbMeetings, setDbMeetings] = useState<DBMeeting[]>([]);
  const [dbTbdCompanies, setDbTbdCompanies] = useState<DBTBDCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [meetingText, setMeetingText] = useState("");
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Record<string, Partial<DBMeeting>>>({});
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  const [tbdExpanded, setTbdExpanded] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [meetingNotes, setMeetingNotes] = useState<Record<string, any[]>>({});
  const [newNoteText, setNewNoteText] = useState<Record<string, string>>({});
  const [newNoteAuthor, setNewNoteAuthor] = useState<Record<string, string>>({});
  const [showAddNoteForm, setShowAddNoteForm] = useState<Record<string, boolean>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{ meetingId: string; company: string } | null>(null);
  const [deleteNoteConfirm, setDeleteNoteConfirm] = useState<{ meetingId: string; noteId: string; author: string } | null>(null);
  const [deleteTBDConfirm, setDeleteTBDConfirm] = useState<{ companyId: string; companyName: string } | null>(null);
  const [parsedMeetingForm, setParsedMeetingForm] = useState<Partial<DBMeeting> | null>(null);
  const [showAddTBD, setShowAddTBD] = useState(false);
  const [newTBDName, setNewTBDName] = useState("");
  const [newTBDContact, setNewTBDContact] = useState("");

  // Load meetings from DB
  useEffect(() => {
    loadMeetings();
    loadTBDCompanies();
  }, []);

  const loadMeetings = async () => {
    try {
      const response = await fetch('/api/meetings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }
      
      const data = await response.json();
      
      // Check if response is an error or if data is an array
      if (data.error) {
        throw new Error(data.error || 'Unknown API error');
      }
      
      // Ensure data is an array
      const meetingsArray = Array.isArray(data) ? data : [];
      setDbMeetings(meetingsArray);
      
      // Initialize expanded days - all collapsed by default
      if (meetingsArray.length > 0) {
        const dates = Array.from(new Set(meetingsArray.map((m: DBMeeting) => m.date))) as string[];
        const initial: Record<string, boolean> = {};
        dates.forEach((date: string) => {
          initial[date] = false; // Start collapsed
        });
        setExpandedDays(initial);
      }
    } catch (error: any) {
      // Set empty array to prevent forEach error
      setDbMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  const loadTBDCompanies = async () => {
    try {
      const response = await fetch('/api/tbd-companies', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        return;
      }
      
      const data = await response.json();
      
      // Check if response is an error or if data is an array
      if (data.error) {
        return;
      }
      
      // Ensure data is an array
      const companiesArray = Array.isArray(data) ? data : [];
      setDbTbdCompanies(companiesArray);
    } catch (error: any) {
      setDbTbdCompanies([]);
    }
  };

  // Group meetings by date - only from DB
  const groupedMeetings = useMemo(() => {
    const grouped: Record<string, DBMeeting[]> = {};
    dbMeetings.forEach(meeting => {
      if (!grouped[meeting.date]) {
        grouped[meeting.date] = [];
      }
      grouped[meeting.date].push(meeting);
    });
    
    // Sort meetings within each day by time
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => {
        // Extract time from format like "14:00-14:30" or "~16:30" or "TBD"
        const getTimeValue = (timeStr: string) => {
          if (!timeStr || timeStr === "TBD") return 9999; // TBD goes to end
          
          // Extract first time (start time)
          const match = timeStr.match(/(\d{1,2}):(\d{2})/);
          if (match) {
            const hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            return hours * 60 + minutes; // Convert to minutes for easy comparison
          }
          
          // If starts with ~, treat as slightly later
          if (timeStr.startsWith('~')) {
            const match = timeStr.match(/~(\d{1,2}):(\d{2})/);
            if (match) {
              const hours = parseInt(match[1], 10);
              const minutes = parseInt(match[2], 10);
              return hours * 60 + minutes + 0.5; // Add 0.5 to put after exact times
            }
          }
          
          return 9998; // Unknown format goes near end
        };
        
        const timeA = getTimeValue(a.time);
        const timeB = getTimeValue(b.time);
        return timeA - timeB;
      });
    });
    
    return grouped;
  }, [dbMeetings]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleParseMeeting = () => {
    if (!meetingText.trim()) return;
    
    const parsed = parseMeetingText(meetingText);
    
    // Populate form with parsed data
    setParsedMeetingForm({
      company: parsed.company || '',
      date: parsed.date || '',
      day: parsed.day || null,
      time: parsed.time || '',
      status: parsed.status || 'confirmed',
      location: parsed.location || '',
      description: parsed.description || '',
      attendees: parsed.attendees || '',
      contact_name: parsed.contact_name || '',
      contact_email: parsed.contact_email || '',
      contact_linkedin: '',
      notes: '',
    });
  };

  const handleSaveMeeting = async () => {
    if (!parsedMeetingForm || !parsedMeetingForm.company) {
      showNotification('Please enter a company name', 'error');
      return;
    }

    const meetingData = {
      company: parsedMeetingForm.company,
      date: parsedMeetingForm.date || "TBD",
      day: parsedMeetingForm.day || null,
      time: parsedMeetingForm.time || "TBD",
      status: parsedMeetingForm.status || 'confirmed',
      location: parsedMeetingForm.location || null,
      description: parsedMeetingForm.description || null,
      attendees: parsedMeetingForm.attendees || null,
      contact_name: parsedMeetingForm.contact_name || null,
      contact_email: parsedMeetingForm.contact_email || null,
      contact_linkedin: parsedMeetingForm.contact_linkedin || null,
      notes: parsedMeetingForm.notes || null,
    };

    try {
      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meetingData),
      });

      if (response.ok) {
        setMeetingText("");
        setParsedMeetingForm(null);
        setShowAddMeeting(false);
        await loadMeetings(); // Reload meetings
        showNotification('Meeting added successfully!', 'success');
      } else {
        const error = await response.json();
        showNotification(`Error: ${error.error}`, 'error');
      }
    } catch (error) {
      showNotification('Error adding meeting', 'error');
    }
  };

  const handleCancelAddMeeting = () => {
    setMeetingText("");
    setParsedMeetingForm(null);
    setShowAddMeeting(false);
  };

  const handleUpdateMeeting = async (meetingId: string, updatedData: Partial<DBMeeting>) => {
    try {
      const response = await fetch(`/api/meetings/${meetingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setEditingMeetingId(null);
        await loadMeetings(); // Reload meetings
        showNotification('Meeting updated successfully!', 'success');
      } else {
        const error = await response.json();
        showNotification(`Error: ${error.error}`, 'error');
      }
    } catch (error) {
      showNotification('Error updating meeting', 'error');
    }
  };

  const handleDeleteClick = (meetingId: string, company: string) => {
    setDeleteConfirm({ meetingId, company });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      const response = await fetch(`/api/meetings/${deleteConfirm.meetingId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setDeleteConfirm(null);
        await loadMeetings(); // Reload meetings
        showNotification('Meeting deleted successfully!', 'success');
      } else {
        const error = await response.json();
        showNotification(`Error: ${error.error}`, 'error');
      }
    } catch (error) {
      showNotification('Error deleting meeting', 'error');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const loadMeetingNotes = async (meetingId: string) => {
    try {
      const response = await fetch(`/api/meetings/${meetingId}/notes`);
      if (response.ok) {
        const notes = await response.json();
        setMeetingNotes(prev => ({
          ...prev,
          [meetingId]: Array.isArray(notes) ? notes : []
        }));
      }
    } catch (error) {
    }
  };

  const handleAddNote = async (meetingId: string) => {
    const noteText = newNoteText[meetingId]?.trim();
    const author = newNoteAuthor[meetingId]?.trim() || 'Anonymous';


    if (!noteText) {
      showNotification('Please enter a note', 'error');
      return;
    }

    try {
      const response = await fetch(`/api/meetings/${meetingId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          note_text: noteText,
          created_by: author
        }),
      });


      if (response.ok) {
        // Check if response has content before parsing JSON
        const contentType = response.headers.get('content-type');
        let data = null;
        
        if (contentType && contentType.includes('application/json')) {
          const text = await response.text();
          
          if (text.trim()) {
            try {
              data = JSON.parse(text);
            } catch (parseError) {
              // If it's empty or invalid, that's okay - the note was still created
            }
          }
        }
        
        setNewNoteText(prev => {
          const updated = { ...prev };
          delete updated[meetingId];
          return updated;
        });
        setNewNoteAuthor(prev => {
          const updated = { ...prev };
          delete updated[meetingId];
          return updated;
        });
        setShowAddNoteForm(prev => {
          const updated = { ...prev };
          delete updated[meetingId];
          return updated;
        });
        await loadMeetingNotes(meetingId);
        showNotification('Note added successfully!', 'success');
      } else {
        let errorMessage = 'Failed to add note';
        try {
          const errorText = await response.text();
          if (errorText.trim()) {
            const error = JSON.parse(errorText);
            errorMessage = error.error || error.message || errorMessage;
          } else {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
        } catch (parseError) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        // Show more helpful error for missing table
        if (errorMessage.includes('meeting_notes') || errorMessage.includes('does not exist') || errorMessage.includes('MISSING_TABLE')) {
          showNotification('Notes table not found. Please create it in Supabase (see console for details).', 'error');
        } else {
          showNotification(`Error: ${errorMessage}`, 'error');
        }
      }
    } catch (error: any) {
      showNotification(`Error: ${error.message || 'Failed to add note'}`, 'error');
    }
  };

  const toggleNotes = (meetingId: string) => {
    const isExpanded = expandedNotes[meetingId];
    setExpandedNotes(prev => ({
      ...prev,
      [meetingId]: !isExpanded
    }));
    
    // Load notes when first expanded
    if (!isExpanded && !meetingNotes[meetingId]) {
      loadMeetingNotes(meetingId);
    }
  };

  const handleDeleteNoteClick = (meetingId: string, noteId: string, author: string) => {
    setDeleteNoteConfirm({ meetingId, noteId, author });
  };

  const handleDeleteNoteConfirm = async () => {
    if (!deleteNoteConfirm) return;

    try {
      const response = await fetch(`/api/meetings/${deleteNoteConfirm.meetingId}/notes/${deleteNoteConfirm.noteId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });


      if (response.ok) {
        await loadMeetingNotes(deleteNoteConfirm.meetingId);
        setDeleteNoteConfirm(null);
        showNotification('Note deleted successfully!', 'success');
      } else {
        let errorMessage = 'Failed to delete note';
        try {
          const errorText = await response.text();
          if (errorText.trim()) {
            const error = JSON.parse(errorText);
            errorMessage = error.error || error.message || errorMessage;
          } else {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
        } catch (parseError) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        showNotification(`Error: ${errorMessage}`, 'error');
      }
    } catch (error: any) {
      showNotification(`Error: ${error.message || 'Failed to delete note'}`, 'error');
    }
  };

  const handleDeleteNoteCancel = () => {
    setDeleteNoteConfirm(null);
  };

  const handleAddTBD = async () => {
    if (!newTBDName.trim()) {
      showNotification('Please enter a company name', 'error');
      return;
    }

    try {
      const response = await fetch('/api/tbd-companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTBDName.trim(),
          contact: newTBDContact.trim() || ''
        }),
      });

      if (response.ok) {
        setNewTBDName('');
        setNewTBDContact('');
        setShowAddTBD(false);
        await loadTBDCompanies();
        showNotification('TBD company added successfully!', 'success');
      } else {
        let errorMessage = 'Failed to add TBD company';
        try {
          const errorText = await response.text();
          if (errorText.trim()) {
            const error = JSON.parse(errorText);
            errorMessage = error.error || error.message || errorMessage;
          } else {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
        } catch (parseError) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        showNotification(`Error: ${errorMessage}`, 'error');
      }
    } catch (error: any) {
      showNotification(`Error: ${error.message || 'Failed to add TBD company'}`, 'error');
    }
  };

  const handleDeleteTDBClick = (companyId: string, companyName: string) => {
    setDeleteTBDConfirm({ companyId, companyName });
  };

  const handleDeleteTBDConfirm = async () => {
    if (!deleteTBDConfirm) return;

    try {
      const response = await fetch(`/api/tbd-companies/${deleteTBDConfirm.companyId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setDeleteTBDConfirm(null);
        await loadTBDCompanies();
        showNotification('TBD company deleted successfully!', 'success');
      } else {
        let errorMessage = 'Failed to delete TBD company';
        try {
          const errorText = await response.text();
          if (errorText.trim()) {
            const error = JSON.parse(errorText);
            errorMessage = error.error || error.message || errorMessage;
          } else {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
        } catch (parseError) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        showNotification(`Error: ${errorMessage}`, 'error');
      }
    } catch (error: any) {
      showNotification(`Error: ${error.message || 'Failed to delete TBD company'}`, 'error');
    }
  };

  const handleDeleteTBDCancel = () => {
    setDeleteTBDConfirm(null);
  };

  const toggleDay = (date: string) => {
    setExpandedDays(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  const filteredCompanies = useMemo(() => {
    let filtered = companies;
    if (searchTerm) {
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.useCase.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.booth.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterType) {
      filtered = filtered.filter((company) => company.type === filterType);
    }
    return filtered;
  }, [searchTerm, filterType]);

  const stats = useMemo(() => {
    const confirmed = dbMeetings.filter(m => m.status === 'confirmed').length;
    const tentative = dbMeetings.filter(m => m.status === 'tentative').length;
    const tbd = dbTbdCompanies.length;
    const total = dbMeetings.length;
    return [
      { label: "Confirmed", value: confirmed, color: "text-green-600" },
      { label: "Tentative", value: tentative, color: "text-blue-600" },
      { label: "TBD", value: tbd, color: "text-orange-600" },
      { label: "Total", value: total, color: "text-gray-900" }
    ];
  }, [dbMeetings, dbTbdCompanies]);

  return (
    <div className="event-page min-h-screen pb-20 md:pb-0">
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleDeleteCancel}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Meeting</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete the meeting with <span className="font-semibold">{deleteConfirm.company}</span>?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Note Confirmation Modal */}
      {deleteNoteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleDeleteNoteCancel}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Note</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete the note by <span className="font-semibold">{deleteNoteConfirm.author}</span>?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteNoteCancel}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteNoteConfirm}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete TBD Company Confirmation Modal */}
      {deleteTBDConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleDeleteTBDCancel}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete TBD Company</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <span className="font-semibold">{deleteTBDConfirm.companyName}</span> from TBD companies?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteTBDCancel}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTBDConfirm}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-5 duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <i className={`fas ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          <span className="font-medium">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Simple Header */}
      <header className="bg-white border-b sticky top-0 z-40 no-print">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Embedded World 2025</h1>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Aurora Labs • Booth #9070</p>
            </div>
            <div className="hidden md:flex gap-1">
              <button
                onClick={() => setActivePage("schedule")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activePage === "schedule" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Schedule
              </button>
              <button
                onClick={() => setActivePage("directory")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activePage === "directory" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Directory
              </button>
              <button
                onClick={() => setActivePage("floorplan")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activePage === "floorplan" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Map
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 no-print safe-area-inset-bottom">
        <div className="flex">
          {(["schedule", "directory", "floorplan"] as const).map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
                activePage === page ? "text-gray-900" : "text-gray-500"
              }`}
            >
              {page === "schedule" && (
                <>
                  <i className={`fas fa-calendar-alt text-base ${activePage === page ? "text-gray-900" : "text-gray-400"}`}></i>
                  <span>Schedule</span>
                </>
              )}
              {page === "directory" && (
                <>
                  <i className={`fas fa-building text-base ${activePage === page ? "text-gray-900" : "text-gray-400"}`}></i>
                  <span>Directory</span>
                </>
              )}
              {page === "floorplan" && (
                <>
                  <i className={`fas fa-map text-base ${activePage === page ? "text-gray-900" : "text-gray-400"}`}></i>
                  <span>Map</span>
                </>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {activePage === "schedule" && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs md:text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
        </div>

            {/* Add Meeting Button */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              {!showAddMeeting ? (
                <button
                  onClick={() => setShowAddMeeting(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <i className="fas fa-plus"></i>
                  <span>Add Meeting</span>
                </button>
              ) : !parsedMeetingForm ? (
                <div className="space-y-3">
                  <textarea
                    value={meetingText}
                    onChange={(e) => setMeetingText(e.target.value)}
                    placeholder="Paste meeting details here (e.g., email or free text)..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none text-sm"
                    rows={8}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleParseMeeting}
                      className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Parse & Review
                    </button>
                    <button
                      onClick={handleCancelAddMeeting}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm font-medium text-gray-700 mb-3">Review and Edit Meeting Details:</div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Company *</label>
                      <input
                        type="text"
                        value={parsedMeetingForm.company || ''}
                        onChange={(e) => setParsedMeetingForm(prev => prev ? {...prev, company: e.target.value} : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="text"
                          value={parsedMeetingForm.date || ''}
                          onChange={(e) => setParsedMeetingForm(prev => prev ? {...prev, date: e.target.value} : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                          placeholder="e.g., November 4, 2025"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Day</label>
                        <input
                          type="text"
                          value={parsedMeetingForm.day || ''}
                          onChange={(e) => setParsedMeetingForm(prev => prev ? {...prev, day: e.target.value} : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                          placeholder="e.g., Tuesday"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Time</label>
                      <input
                        type="text"
                        value={parsedMeetingForm.time || ''}
                        onChange={(e) => setParsedMeetingForm(prev => prev ? {...prev, time: e.target.value} : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="e.g., 14:00-14:30"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={parsedMeetingForm.location || ''}
                        onChange={(e) => setParsedMeetingForm(prev => prev ? {...prev, location: e.target.value} : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="e.g., Aurora Booth 9070"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Contact Name</label>
                        <input
                          type="text"
                          value={parsedMeetingForm.contact_name || ''}
                          onChange={(e) => setParsedMeetingForm(prev => prev ? {...prev, contact_name: e.target.value} : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Contact Email</label>
                        <input
                          type="email"
                          value={parsedMeetingForm.contact_email || ''}
                          onChange={(e) => setParsedMeetingForm(prev => prev ? {...prev, contact_email: e.target.value} : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Attendees</label>
                      <input
                        type="text"
                        value={parsedMeetingForm.attendees || ''}
                        onChange={(e) => setParsedMeetingForm(prev => prev ? {...prev, attendees: e.target.value} : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="e.g., Mor, Zohar"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={parsedMeetingForm.description || ''}
                        onChange={(e) => setParsedMeetingForm(prev => prev ? {...prev, description: e.target.value} : null)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                      <textarea
                        value={parsedMeetingForm.notes || ''}
                        onChange={(e) => setParsedMeetingForm(prev => prev ? {...prev, notes: e.target.value} : null)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                        placeholder="e.g., Unstable meeting - needs confirmation"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={parsedMeetingForm.status || 'confirmed'}
                        onChange={(e) => setParsedMeetingForm(prev => prev ? {...prev, status: e.target.value as 'confirmed' | 'tentative' | 'tbd'} : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="tentative">Tentative</option>
                        <option value="tbd">TBD</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSaveMeeting}
                      className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Save Meeting
                    </button>
                    <button
                      onClick={() => setParsedMeetingForm(null)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Back to Edit
                    </button>
                    <button
                      onClick={handleCancelAddMeeting}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Meetings */}
            {loading ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <div className="text-gray-400">Loading meetings...</div>
              </div>
            ) : Object.keys(groupedMeetings).length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <div className="text-gray-400 mb-2">No meetings found</div>
                <div className="text-sm text-gray-500">Try adding a meeting using the button above</div>
              </div>
            ) : (
              Object.entries(groupedMeetings)
                .sort((a, b) => {
                  // Simple date comparison - you might want to improve this
                  return a[0].localeCompare(b[0]);
                })
                .map(([date, dayMeetings]) => {
                  const firstMeeting = dayMeetings[0];
                  const dayName = firstMeeting.day || "";
                  return (
                    <div key={date} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => toggleDay(date)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                      >
                        <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                          {date} {dayName && <span className="text-gray-500 font-normal">({dayName})</span>}
                          <span className="ml-3 text-sm font-normal text-gray-400">({dayMeetings.length} meetings)</span>
                        </h2>
                        <i className={`fas fa-chevron-${expandedDays[date] ? 'up' : 'down'} text-gray-400 transition-transform`}></i>
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        expandedDays[date] ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        <div className="px-4 pb-4 space-y-3">
                          {dayMeetings.map((meeting) => {
                            const isEditing = editingMeetingId === meeting.id;
                            const editForm = editFormData[meeting.id] || {
                              company: meeting.company,
                              attendees: meeting.attendees || '',
                              location: meeting.location || '',
                              contact_name: meeting.contact_name || '',
                              contact_email: meeting.contact_email || '',
                              contact_linkedin: meeting.contact_linkedin || '',
                              description: meeting.description || '',
                              notes: meeting.notes || '',
                            };

                            const updateEditForm = (field: string, value: string) => {
                              setEditFormData(prev => ({
                                ...prev,
                                [meeting.id]: {
                                  ...prev[meeting.id],
                                  ...editForm,
                                  [field]: value,
                                }
                              }));
                            };

                            return (
                              <div key={meeting.id} className="bg-white rounded-xl p-4 md:p-5 border border-gray-200">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                                        meeting.status === "confirmed" ? "bg-green-100 text-green-700" :
                                        meeting.status === "tentative" ? "bg-blue-100 text-blue-700" :
                                        "bg-orange-100 text-orange-700"
                                      }`}>
                                        {meeting.time}
                                      </span>
                                      {meeting.is_new && (
                                        <span className="text-xs font-medium px-2 py-1 rounded bg-purple-100 text-purple-700">⭐ NEW</span>
                                      )}
                                    </div>
                                    {isEditing ? (
                                      <input
                                        type="text"
                                        value={editForm.company || ''}
                                        onChange={(e) => updateEditForm('company', e.target.value)}
                                        className="text-base md:text-lg font-semibold text-gray-900 w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
                                      />
                                    ) : (
                                      <h3 className="text-base md:text-lg font-semibold text-gray-900">{meeting.company}</h3>
                                    )}
                                  </div>
                                  {!isEditing && (
                                    <div className="ml-2 flex gap-2">
                                      <button
                                        onClick={() => {
                                          setEditingMeetingId(meeting.id);
                                          setEditFormData(prev => ({
                                            ...prev,
                                            [meeting.id]: {
                                              company: meeting.company,
                                              attendees: meeting.attendees || '',
                                              location: meeting.location || '',
                                              contact_name: meeting.contact_name || '',
                                              contact_email: meeting.contact_email || '',
                                              contact_linkedin: meeting.contact_linkedin || '',
                                              description: meeting.description || '',
                                              notes: meeting.notes || '',
                                            }
                                          }));
                                        }}
                                        className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors flex items-center gap-1.5"
                                        title="Edit meeting"
                                      >
                                        <i className="fas fa-edit text-xs"></i>
                                        <span>Edit</span>
                                      </button>
                                      <button
                                        onClick={() => handleDeleteClick(meeting.id, meeting.company)}
                                        className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors flex items-center gap-1.5"
                                        title="Delete meeting"
                                      >
                                        <i className="fas fa-trash text-xs"></i>
                                        <span>Delete</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                                {isEditing ? (
                                  <div className="space-y-3">
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">Company</label>
                                      <input
                                        type="text"
                                        value={editForm.company || ''}
                                        onChange={(e) => updateEditForm('company', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">Attendees</label>
                                      <input
                                        type="text"
                                        value={editForm.attendees || ''}
                                        onChange={(e) => updateEditForm('attendees', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                                        placeholder="e.g., Mor, Zohar"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                                      <input
                                        type="text"
                                        value={editForm.location || ''}
                                        onChange={(e) => updateEditForm('location', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                                        placeholder="e.g., Aurora Booth 9070"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">Contact Name</label>
                                      <input
                                        type="text"
                                        value={editForm.contact_name || ''}
                                        onChange={(e) => updateEditForm('contact_name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">Contact Email</label>
                                      <input
                                        type="email"
                                        value={editForm.contact_email || ''}
                                        onChange={(e) => updateEditForm('contact_email', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">LinkedIn URL</label>
                                      <input
                                        type="url"
                                        value={editForm.contact_linkedin || ''}
                                        onChange={(e) => updateEditForm('contact_linkedin', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                                      />
                                    </div>
              <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                                      <textarea
                                        value={editForm.description || ''}
                                        onChange={(e) => updateEditForm('description', e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                                        placeholder="LOCI platform collaboration discussion - AI-driven observability for ARM 32/64-bit and AURIX TriCore"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                                      <textarea
                                        value={editForm.notes || ''}
                                        onChange={(e) => updateEditForm('notes', e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                                        placeholder="e.g., Unstable meeting - needs confirmation"
                                      />
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                      <button
                                        onClick={() => {
                                          handleUpdateMeeting(meeting.id, editForm);
                                          // Clear form data after save
                                          setEditFormData(prev => {
                                            const updated = { ...prev };
                                            delete updated[meeting.id];
                                            return updated;
                                          });
                                        }}
                                        className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => {
                                          setEditingMeetingId(null);
                                          // Clear form data on cancel
                                          setEditFormData(prev => {
                                            const updated = { ...prev };
                                            delete updated[meeting.id];
                                            return updated;
                                          });
                                        }}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-2 text-sm text-gray-600">
                                    {meeting.attendees && <div><span className="font-medium">Attendees:</span> {meeting.attendees}</div>}
                                    {meeting.location && <div><span className="font-medium">Location:</span> {meeting.location}</div>}
                                    {(meeting.contact_name || meeting.contact_email || meeting.contact_linkedin) && (
                                      <div>
                                        <span className="font-medium">Contact:</span>{" "}
                                        {meeting.contact_linkedin ? (
                                          <a href={meeting.contact_linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            {meeting.contact_name || 'LinkedIn'}
                                          </a>
                                        ) : (
                                          meeting.contact_name || ''
                                        )}
                                        {meeting.contact_email && ` (${meeting.contact_email})`}
                                      </div>
                                    )}
                                    {meeting.description && <div className="text-gray-700">{meeting.description}</div>}
                                    {meeting.website && (
                                      <div className="text-xs text-gray-500 break-all">{meeting.website}</div>
                                    )}
                                    {meeting.notes && (
                                      <div className={`text-xs ${meeting.status === "tentative" ? "text-orange-600 font-medium" : "text-gray-500"}`}>
                                        {meeting.notes}
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {/* Notes Section */}
                                <div className="mt-4 border-t border-gray-200 pt-3">
                                  <button
                                    onClick={() => toggleNotes(meeting.id)}
                                    className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                                  >
                                    <span className="flex items-center gap-2">
                                      <i className={`fas fa-chevron-${expandedNotes[meeting.id] ? 'up' : 'down'} text-xs`}></i>
                                      Notes {meetingNotes[meeting.id]?.length ? `(${meetingNotes[meeting.id].length})` : ''}
                                    </span>
                                  </button>
                                  
                                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    expandedNotes[meeting.id] ? 'max-h-[2000px] opacity-100 mt-3' : 'max-h-0 opacity-0'
                                  }`}>
                                    {/* Notes List - Show first if there are notes */}
                                    {meetingNotes[meeting.id]?.length > 0 && (
                                      <div className="space-y-2 mb-4">
                                        {meetingNotes[meeting.id].map((note: any) => (
                                          <div key={note.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                              <div className="text-sm text-gray-900">{note.note_text}</div>
                                              <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                                <span className="font-medium">{note.created_by}</span>
                                                <span>•</span>
                                                <span>{new Date(note.created_at).toLocaleString()}</span>
                                              </div>
                                            </div>
                                            <button
                                              onClick={() => handleDeleteNoteClick(meeting.id, note.id, note.created_by)}
                                              className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded transition-colors flex items-center gap-1 flex-shrink-0"
                                              title="Delete note"
                                            >
                                              <i className="fas fa-trash text-xs"></i>
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {/* Add Note Form - Show if no notes OR if user clicked "Add Note" */}
                                    {(!meetingNotes[meeting.id]?.length || showAddNoteForm[meeting.id]) ? (
                                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                        <div className="mb-2">
                                          <input
                                            type="text"
                                            placeholder="Your name"
                                            value={newNoteAuthor[meeting.id] || ''}
                                            onChange={(e) => setNewNoteAuthor(prev => ({
                                              ...prev,
                                              [meeting.id]: e.target.value
                                            }))}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                                          />
                                        </div>
                                        <div className="mb-2">
                                          <textarea
                                            placeholder="Add a note..."
                                            value={newNoteText[meeting.id] || ''}
                                            onChange={(e) => setNewNoteText(prev => ({
                                              ...prev,
                                              [meeting.id]: e.target.value
                                            }))}
                                            rows={3}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                                          />
                                        </div>
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => handleAddNote(meeting.id)}
                                            className="flex-1 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors"
                                          >
                                            Add Note
                                          </button>
                                          {meetingNotes[meeting.id]?.length > 0 && (
                                            <button
                                              onClick={() => {
                                                setShowAddNoteForm(prev => {
                                                  const updated = { ...prev };
                                                  delete updated[meeting.id];
                                                  return updated;
                                                });
                                                setNewNoteText(prev => {
                                                  const updated = { ...prev };
                                                  delete updated[meeting.id];
                                                  return updated;
                                                });
                                                setNewNoteAuthor(prev => {
                                                  const updated = { ...prev };
                                                  delete updated[meeting.id];
                                                  return updated;
                                                });
                                              }}
                                              className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                                            >
                                              Cancel
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => setShowAddNoteForm(prev => ({ ...prev, [meeting.id]: true }))}
                                        className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
                                      >
                                        <i className="fas fa-plus text-xs"></i>
                                        Add Note
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

            {/* TBD */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setTbdExpanded(!tbdExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
              >
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  TBD Meetings <span className="text-gray-500 font-normal">({dbTbdCompanies.length})</span>
                </h2>
                <i className={`fas fa-chevron-${tbdExpanded ? 'up' : 'down'} text-gray-400 transition-transform`}></i>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                tbdExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-4 pb-4">
                  {/* Add TBD Form */}
                  {showAddTBD ? (
                    <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Add TBD Company</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Company Name *</label>
                          <input
                            type="text"
                            value={newTBDName}
                            onChange={(e) => setNewTBDName(e.target.value)}
                            placeholder="Enter company name"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Contact (optional)</label>
                          <input
                            type="text"
                            value={newTBDContact}
                            onChange={(e) => setNewTBDContact(e.target.value)}
                            placeholder="Enter contact info"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={handleAddTBD}
                            className="flex-1 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setShowAddTBD(false);
                              setNewTBDName('');
                              setNewTBDContact('');
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <button
                        onClick={() => setShowAddTBD(true)}
                        className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <i className="fas fa-plus text-xs"></i>
                        Add TBD Company
                      </button>
                    </div>
                  )}

                  {/* TBD Companies List */}
                  {dbTbdCompanies.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <div className="text-sm">No TBD companies found</div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {dbTbdCompanies.map((company) => (
                        <div key={company.id} className="bg-gray-50 rounded-xl p-3 border border-gray-200 flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900">{company.name}</div>
                            {company.contact && (
                              <div className="text-xs text-gray-500 mt-1">{company.contact}</div>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteTDBClick(company.id, company.name)}
                            className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded transition-colors flex items-center gap-1 flex-shrink-0"
                            title="Delete TBD company"
                          >
                            <i className="fas fa-trash text-xs"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activePage === "directory" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{companies.length}</div>
                <div className="text-xs md:text-sm text-gray-600 mt-1">Companies</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="text-2xl md:text-3xl font-bold text-gray-900">8</div>
                <div className="text-xs md:text-sm text-gray-600 mt-1">Categories</div>
              </div>
              </div>

            {/* Search */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search companies..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="">All Types</option>
                  <option value="Module/COM/Board Vendor">Module/COM/Board Vendor</option>
                  <option value="Consulting/Services/Embedded Houses">Consulting/Services</option>
                  <option value="Semiconductor/MCU/SoC">Semiconductor/MCU</option>
                  <option value="RTOS/Toolchain/Debug">RTOS/Toolchain</option>
                  <option value="Security/Vulnerability">Security</option>
                  <option value="Design/EDA/IP/ASIC">Design/EDA/IP</option>
                  <option value="Embedded/Industrial Vendor">Industrial Vendor</option>
                  <option value="Connectivity/IoT Modules">Connectivity/IoT</option>
                </select>
              </div>
                  </div>

            {/* Companies - Mobile Cards */}
            <div className="md:hidden space-y-3">
              {filteredCompanies.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                  <div className="text-gray-400 mb-2">No companies found</div>
                  <div className="text-sm text-gray-500">Try adjusting your search</div>
                </div>
              ) : (
                filteredCompanies.map((company, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 flex-1">{company.name}</h3>
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded ml-2">
                        {company.booth}
                      </span>
                </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{company.useCase}</p>
                    <span className={`inline-block ${getBadgeClass(company.type)} text-white text-xs px-2 py-1 rounded`}>
                      {company.type.split('/')[0]}
                    </span>
                </div>
                ))
              )}
        </div>

            {/* Companies - Desktop Table */}
            <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Booth</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Use Case</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCompanies.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No companies found</td>
                      </tr>
                    ) : (
                      filteredCompanies.map((company, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">{company.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{company.booth}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{company.useCase}</td>
                          <td className="px-6 py-4">
                            <span className={`${getBadgeClass(company.type)} text-white text-xs px-2 py-1 rounded`}>
                              {company.type.split('/')[0]}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        )}

        {activePage === "floorplan" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Floor Plan</h2>
              <div className="w-full" style={{ minHeight: "600px", height: "calc(100vh - 300px)" }}>
                <iframe
                  src="/api/floorplan"
                  className="w-full h-full border-0 rounded-lg"
                  title="Floor Plan PDF"
                  style={{ minHeight: "600px" }}
                />
              </div>
              <div className="mt-4 text-center">
                <a
                  href="/api/floorplan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm"
                >
                  Download PDF
                </a>
              </div>
        </div>
      </div>
        )}
      </main>
    </div>
  );
}
