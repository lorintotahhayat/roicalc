"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import "../morhayat/morhayat.css";

const contactInfo = {
  name: "Zohar Fox",
  title: "CEO & Co Founder",
  company: "Aurora Labs",
  email: "zohar@auroralabs.com",
  phone: "+972 54-222-0020",
  address: "45 Rothschild St, Tel Aviv, Israel",
  linkedin: "https://www.linkedin.com/in/zohar-fox?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
};

export default function ZoharFoxPage() {

  const generateVCard = () => {
    return `BEGIN:VCARD
VERSION:3.0
FN:${contactInfo.name}
N:Fox;Zohar;;;
${contactInfo.title ? `TITLE:${contactInfo.title}` : ''}
${contactInfo.company ? `ORG:${contactInfo.company}` : ''}
TEL;TYPE=CELL:${contactInfo.phone.replace(/[^0-9+]/g, "")}
EMAIL:${contactInfo.email}
ADR;TYPE=WORK:;;${contactInfo.address}
URL:${contactInfo.linkedin}
END:VCARD`;
  };

  const saveContact = () => {
    const vCardData = generateVCard();
    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Zohar_Fox.vcf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    showNotification("Contact saved successfully!");
  };

  const shareCard = async () => {
    const shareData = {
      title: `${contactInfo.name} - ${contactInfo.title}`,
      text: `Connect with ${contactInfo.name}, ${contactInfo.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showNotification("Thanks for sharing!");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showNotification("Link copied to clipboard!");
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(window.location.href);
          showNotification("Link copied to clipboard!");
        } catch {
          showNotification("Unable to share. Please copy the URL manually.");
        }
      }
    }
  };

  const showNotification = (message: string) => {
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #6B46C1 0%, #EC4899 50%, #F97316 100%);
      color: white;
      padding: 16px 32px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 600;
      z-index: 1000;
      animation: slideDown 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideDown 0.3s ease-out reverse";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  };

  const handleContactClick = async (
    e: React.MouseEvent<HTMLDivElement>,
    type: string,
    value: string
  ) => {
    e.preventDefault();

    if (type === "whatsapp") {
      window.open(`https://wa.me/${contactInfo.phone.replace(/[^0-9]/g, "")}`, "_blank");
      showNotification("Opening WhatsApp...");
      return;
    }

    if (type === "linkedin") {
      window.open(contactInfo.linkedin, "_blank");
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      showNotification(`Copied: ${value}`);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }
    `;
    document.head.appendChild(style);

    const gradient = document.querySelector(".gradient-background") as HTMLElement;
    if (gradient) {
      const handleMouseMove = (e: MouseEvent) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        const moveX = (mouseX - 0.5) * 20;
        const moveY = (mouseY - 0.5) * 20;
        gradient.style.transform = `translate(${moveX}px, ${moveY}px)`;
      };

      document.addEventListener("mousemove", handleMouseMove);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, []);


  return (
    <>
      <div className="morhayat-page">
        <div className="gradient-background"></div>

        <div className="container">
          <div className="business-card">
            <div className="profile-section">
              <div className="profile-circle">
                <Image 
                  src="/images/zohar.jpeg" 
                  alt={contactInfo.name}
                  width={70}
                  height={70}
                  className="profile-photo"
                  priority
                />
              </div>
              <h1 className="name">{contactInfo.name}</h1>
              {contactInfo.title && <h2 className="title">{contactInfo.title}</h2>}
              {contactInfo.company && <p className="company">{contactInfo.company}</p>}
            </div>

            <div className="contact-section">
              <div
                className="contact-item"
                onClick={(e) =>
                  handleContactClick(e, "email", contactInfo.email)
                }
              >
                <i className="fas fa-envelope"></i>
                <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
              </div>

              <div
                className="contact-item"
                onClick={(e) =>
                  handleContactClick(e, "whatsapp", contactInfo.phone)
                }
              >
                <i className="fab fa-whatsapp"></i>
                <a
                  href={`https://wa.me/${contactInfo.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contactInfo.phone}
                </a>
              </div>

              <div
                className="contact-item"
                onClick={(e) =>
                  handleContactClick(e, "address", contactInfo.address)
                }
              >
                <i className="fas fa-map-marker-alt"></i>
                <span>{contactInfo.address}</span>
              </div>

              <div
                className="contact-item"
                onClick={(e) =>
                  handleContactClick(e, "linkedin", contactInfo.linkedin)
                }
              >
                <i className="fab fa-linkedin"></i>
                <a
                  href={contactInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  linkedin.com/in/zohar-fox
                </a>
              </div>
            </div>

            <div className="qr-section">
              <h3 className="qr-title">Connect with me</h3>
              <div className="qr-code-container">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(contactInfo.linkedin)}&color=4C1D95&bgcolor=FFFFFF`}
                  alt="QR Code linking to LinkedIn profile"
                  className="qr-code-image"
                  width={100}
                  height={100}
                  loading="lazy"
                />
              </div>
              <p className="qr-subtitle">Scan to view my LinkedIn profile</p>
            </div>

            <div className="action-buttons">
              <button className="btn btn-primary" onClick={saveContact}>
                <i className="fas fa-download"></i>
                Save Contact
              </button>
              <button className="btn btn-secondary" onClick={shareCard}>
                <i className="fas fa-share-alt"></i>
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

