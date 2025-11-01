/**
 * Digital Business Card - Main JavaScript
 * For: Mor Hayat, Director Business Development at Aurora Labs
 */

// Contact Information
const contactInfo = {
    name: 'Mor Hayat',
    title: 'Director Business Development',
    company: 'Aurora Labs',
    email: 'mor.hayat@auroralabs.com',
    phone: '+972542600177',
    address: '45 Rothschild St, Tel Aviv, Israel',
    linkedin: 'https://www.linkedin.com/in/mor-hayat/'
};

/**
 * Initialize QR Code
 * Generates a QR code linking to LinkedIn profile
 */
function initializeQRCode() {
    const canvas = document.getElementById('qrcode');
    
    if (!canvas) {
        console.error('QR code canvas not found');
        return;
    }
    
    // Check if QRCode library is loaded
    if (typeof QRCode === 'undefined') {
        console.warn('QRCode library not loaded, using fallback API');
        useFallbackQRCode(canvas);
        return;
    }
    
    try {
        QRCode.toCanvas(canvas, contactInfo.linkedin, {
            width: 200,
            height: 200,
            margin: 2,
            color: {
                dark: '#4C1D95',  // Deep purple from Aurora Labs brand
                light: '#FFFFFF'
            },
            errorCorrectionLevel: 'H'
        }, function (error) {
            if (error) {
                console.error('QR Code generation error:', error);
                useFallbackQRCode(canvas);
            } else {
                console.log('QR Code generated successfully');
            }
        });
    } catch (error) {
        console.error('Failed to generate QR code:', error);
        useFallbackQRCode(canvas);
    }
}

/**
 * Fallback QR Code using external API
 * Used when QRCode library fails to load
 */
function useFallbackQRCode(canvas) {
    const container = canvas.parentElement;
    
    // Remove canvas
    canvas.remove();
    
    // Create image element for QR code
    const img = document.createElement('img');
    const encodedUrl = encodeURIComponent(contactInfo.linkedin);
    
    // Using QR Server API as fallback
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUrl}&color=4C1D95&bgcolor=FFFFFF`;
    img.alt = 'QR Code linking to LinkedIn profile';
    img.style.width = '200px';
    img.style.height = '200px';
    img.style.display = 'block';
    
    // Handle load error
    img.onerror = function() {
        console.error('Fallback QR code also failed');
        // Last resort: Display text with link
        const textFallback = document.createElement('div');
        textFallback.style.cssText = 'text-align: center; padding: 20px; font-size: 14px;';
        textFallback.innerHTML = `
            <p style="margin-bottom: 10px; color: #4B5563;">QR Code unavailable</p>
            <a href="${contactInfo.linkedin}" target="_blank" style="color: #6B46C1; text-decoration: underline;">
                Visit LinkedIn Profile
            </a>
        `;
        container.appendChild(textFallback);
    };
    
    img.onload = function() {
        console.log('Fallback QR code loaded successfully');
    };
    
    container.appendChild(img);
}

/**
 * Generate vCard data
 * Creates a vCard format string for contact download
 */
function generateVCard() {
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${contactInfo.name}
N:Hayat;Mor;;;
ORG:${contactInfo.company}
TITLE:${contactInfo.title}
TEL;TYPE=CELL:${contactInfo.phone}
EMAIL:${contactInfo.email}
ADR;TYPE=WORK:;;${contactInfo.address}
URL:${contactInfo.linkedin}
END:VCARD`;
    
    return vCard;
}

/**
 * Save Contact as vCard
 * Downloads contact information as a .vcf file
 */
function saveContact() {
    const vCardData = generateVCard();
    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Mor_Hayat_Aurora_Labs.vcf';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
    
    // Visual feedback
    showNotification('Contact saved successfully!');
}

/**
 * Share Business Card
 * Uses Web Share API if available, fallback to clipboard
 */
async function shareCard() {
    const shareData = {
        title: `${contactInfo.name} - ${contactInfo.title}`,
        text: `Connect with ${contactInfo.name}, ${contactInfo.title} at ${contactInfo.company}`,
        url: window.location.href
    };
    
    try {
        // Check if Web Share API is supported
        if (navigator.share) {
            await navigator.share(shareData);
            showNotification('Thanks for sharing!');
        } else {
            // Fallback: Copy URL to clipboard
            await navigator.clipboard.writeText(window.location.href);
            showNotification('Link copied to clipboard!');
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Error sharing:', error);
            // Try clipboard as fallback
            try {
                await navigator.clipboard.writeText(window.location.href);
                showNotification('Link copied to clipboard!');
            } catch (clipboardError) {
                showNotification('Unable to share. Please copy the URL manually.');
            }
        }
    }
}

/**
 * Show Notification
 * Displays a temporary notification message
 */
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add styles
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
    
    // Add animation
    const style = document.createElement('style');
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
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease-out reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * Add Interactive Hover Effects
 * Enhances contact items with click-to-copy functionality
 */
function addInteractiveEffects() {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        const link = item.querySelector('a');
        const span = item.querySelector('span');
        
        if (link || span) {
            item.style.cursor = 'pointer';
            
            item.addEventListener('click', async (e) => {
                e.preventDefault();
                
                let textToCopy = '';
                if (link) {
                    if (link.href.startsWith('mailto:')) {
                        textToCopy = link.textContent;
                    } else if (link.href.startsWith('tel:')) {
                        textToCopy = link.textContent;
                    } else if (link.href.includes('wa.me')) {
                        // WhatsApp link - open directly
                        window.open(link.href, '_blank');
                        showNotification('Opening WhatsApp...');
                        return;
                    } else {
                        textToCopy = link.href;
                        window.open(link.href, '_blank');
                        return;
                    }
                } else if (span) {
                    textToCopy = span.textContent;
                }
                
                try {
                    await navigator.clipboard.writeText(textToCopy);
                    showNotification(`Copied: ${textToCopy}`);
                } catch (error) {
                    console.error('Failed to copy:', error);
                }
            });
        }
    });
}

/**
 * Add Parallax Effect to Background
 * Creates subtle mouse movement effect
 */
function addParallaxEffect() {
    const gradient = document.querySelector('.gradient-background');
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const moveX = (mouseX - 0.5) * 20;
        const moveY = (mouseY - 0.5) * 20;
        
        gradient.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
}

/**
 * Initialize Everything
 * Called when DOM is fully loaded
 */
function init() {
    console.log('Initializing Digital Business Card...');
    
    // Generate QR Code
    initializeQRCode();
    
    // Add event listeners
    const saveContactBtn = document.getElementById('saveContactBtn');
    const shareBtn = document.getElementById('shareBtn');
    
    if (saveContactBtn) {
        saveContactBtn.addEventListener('click', saveContact);
    }
    
    if (shareBtn) {
        shareBtn.addEventListener('click', shareCard);
    }
    
    // Add interactive effects
    addInteractiveEffects();
    
    // Add parallax effect (subtle)
    addParallaxEffect();
    
    console.log('Digital Business Card initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Handle window resize for responsive adjustments
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Regenerate QR code on significant resize
        const canvas = document.getElementById('qrcode');
        if (canvas && window.innerWidth < 480) {
            // Adjust QR code size for mobile
            QRCode.toCanvas(canvas, contactInfo.linkedin, {
                width: 180,
                height: 180,
                margin: 2,
                color: {
                    dark: '#4C1D95',
                    light: '#FFFFFF'
                }
            });
        }
    }, 250);
});
