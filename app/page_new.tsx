"use client";

import React, { useState, useMemo } from "react";
import "../event/event.css";

// ... (companies array stays the same) ...
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

// ... (meetings array stays the same) ...
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

export default function EventPage() {
  const [activePage, setActivePage] = useState<"schedule" | "directory" | "floorplan">("schedule");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>(() => {
    // Start with all days expanded by default
    const initial: Record<string, boolean> = {};
    meetings.forEach(day => {
      initial[day.date] = true;
    });
    return initial;
  });
  const [tbdExpanded, setTbdExpanded] = useState(true);

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

  return (
    <div className="event-page min-h-screen pb-20 md:pb-0">
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
              {[
                { label: "Confirmed", value: 14, color: "text-green-600" },
                { label: "Tentative", value: 1, color: "text-blue-600" },
                { label: "TBD", value: 18, color: "text-orange-600" },
                { label: "Total", value: 33, color: "text-gray-900" }
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs md:text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Meetings */}
            {meetings.map((day) => (
              <div key={day.date} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleDay(day.date)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                    {day.date} <span className="text-gray-500 font-normal">({day.day})</span>
                    <span className="ml-3 text-sm font-normal text-gray-400">({day.meetings.length} meetings)</span>
                  </h2>
                  <i className={`fas fa-chevron-${expandedDays[day.date] ? 'up' : 'down'} text-gray-400 transition-transform`}></i>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedDays[day.date] ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-4 pb-4 space-y-3">
                    {day.meetings.map((meeting, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-4 md:p-5 border border-gray-200">
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
                            {'isNew' in meeting && meeting.isNew && (
                              <span className="text-xs font-medium px-2 py-1 rounded bg-purple-100 text-purple-700">⭐ NEW</span>
                            )}
                          </div>
                          <h3 className="text-base md:text-lg font-semibold text-gray-900">{meeting.company}</h3>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div><span className="font-medium">Attendees:</span> {meeting.attendees}</div>
                        <div><span className="font-medium">Location:</span> {meeting.location}</div>
                        {meeting.contact && (
                          <div>
                            <span className="font-medium">Contact:</span>{" "}
                            {meeting.contact.linkedin ? (
                              <a href={meeting.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {meeting.contact.name}
                              </a>
                            ) : (
                              meeting.contact.name
                            )}
                            {meeting.contact.email && ` (${meeting.contact.email})`}
                          </div>
                        )}
                        {meeting.description && <div className="text-gray-700">{meeting.description}</div>}
                        {'website' in meeting && meeting.website && (
                          <div className="text-xs text-gray-500 break-all">{meeting.website}</div>
                        )}
                        {'notes' in meeting && meeting.notes && (
                          <div className={`text-xs ${meeting.status === "tentative" ? "text-orange-600 font-medium" : "text-gray-500"}`}>
                            {meeting.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
              </div>
            ))}

            {/* TBD */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setTbdExpanded(!tbdExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
              >
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  TBD Meetings <span className="text-gray-500 font-normal">({tbdCompanies.length})</span>
                </h2>
                <i className={`fas fa-chevron-${tbdExpanded ? 'up' : 'down'} text-gray-400 transition-transform`}></i>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                tbdExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {tbdCompanies.map((company, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                        <div className="font-medium text-sm text-gray-900">{company.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{company.contact}</div>
                      </div>
                    ))}
                  </div>
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
